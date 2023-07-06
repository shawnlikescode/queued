import { z } from "zod";

import { getWeekNumber, getYear } from "~/utils/queueUtils";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const queueRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.queue.findUnique({
        where: {
          id: input.id,
        },
        include: {
          entries: true,
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.queue.findMany({
      include: {
        entries: true,
      },
    });
  }),

  create: protectedProcedure.mutation(({ ctx, input }) => {
    return ctx.prisma.queue.create({
      data: {
        queueWeek: `W${getWeekNumber()}-${getYear()}`,
      },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.queue.update({
        where: {
          id: input.id,
        },
        data: {
          queueWeek: `W${getWeekNumber()}-${getYear()}`,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.queue.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
