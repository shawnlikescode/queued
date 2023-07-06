import { z } from "zod";

import { getWeekNumber, getYear } from "~/utils/queueUtils";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const queueEntryRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.queueEntry.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.queueEntry.findMany({
      include: {
        song: true,
        queue: true,
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        songId: z.string(),
        queueId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.queueEntry.create({
        data: {
          song: { connect: { id: input.songId } },
          queue: { connect: { id: input.queueId } },
          queueWeek: `W${getWeekNumber()}-${getYear()}`,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.queueEntry.delete({
        where: {
          id: input.id,
        },
      });
    }),
  upvote: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.queueEntry.update({
        where: {
          id: input.id,
        },
        data: {
          vote: {
            create: {
              user: { connect: { id: ctx.session.user.id } },
              voteType: "UP",
            },
          },
        },
      });
    }),
  downvote: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.queueEntry.update({
        where: {
          id: input.id,
        },
        data: {
          vote: {
            create: {
              user: { connect: { id: ctx.session.user.id } },
              voteType: "DOWN",
            },
          },
        },
      });
    }),
});
