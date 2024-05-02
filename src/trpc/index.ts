import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import {z} from 'zod'
import axios from 'axios'
import { UTApi } from "uploadthing/server";

const utapi = new UTApi;
 
export const appRouter = router({
    authCallback: publicProcedure.query(async () => {
        const {getUser} = getKindeServerSession();
        const user = await getUser();
        
        if(!user || !user.id || !user.email) {
            throw new TRPCError({code: "UNAUTHORIZED"})
        }

        const dbUser = await db.user.findFirst({
            where: {
                id: user.id
            }
        })

        if(!dbUser) {
            await db.user.create({
                data: {
                    id: user.id,
                    email: user.email
                }
            })
        }

        return {success: true};
    }),
    getUserFiles: privateProcedure.query(async ({ctx}) => {
        const {userId} = ctx;

        return await db.file?.findMany({
            where: {
                userId: userId
            }
        })
    }),
    getFile: privateProcedure.input(z.object({key: z.string()})).mutation( async ({ctx, input}) => {
        const {userId} = ctx;
        console.log("Get File ", input.key)
        const file = await db.file.findFirst({
            where: {
                key: input.key,
                userId
            }
        })

        if(!file) {
            throw new TRPCError({code: "NOT_FOUND"});
        }
        return file

    }),
    deleteFile: privateProcedure.input(z.object({id: z.string()})).mutation(async ({ctx, input}) => {
        const {userId} = ctx;

        const file = await db.file.findFirst({
            where: {
                id: input.id,
                userId
            }
        })

        if(!file) throw new TRPCError({code: "NOT_FOUND"});
        
        const deleteFromUT = await utapi.deleteFiles(file.key);
        if (!deleteFromUT.success) {
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR"});
        } 

        await db.file.delete({
            where: {
                id: input.id
            }
        })

        return file;
    })
});
 
export type AppRouter = typeof appRouter;