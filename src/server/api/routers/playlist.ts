import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const playlistRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.playlist.findUnique({
        where: {
          id: input.id,
        },
        include: {
          songs: true,
          User: true,
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.playlist.findMany({
      include: {
        songs: true,
        User: true,
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        queueId: z.string(),
        title: z.string(),
        public: z.boolean().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const queue = ctx.prisma.queue.findUnique({
        where: {
          id: input.queueId,
        },
        select: {
          entries: {
            select: {
              songId: true,
            },
          },
        },
      });

      if (!queue) {
        throw new Error("Queue not found");
      }

      const songIds = queue.entries;

      console.log(songIds);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        public: z.boolean().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.playlist.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          public: input.public,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.playlist.delete({
        where: {
          id: input.id,
        },
      });
    }),

  addToPlaylist: protectedProcedure
    .input(
      z.object({
        playlistId: z.string(),
        songId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.playlist.update({
        where: {
          id: input.playlistId,
        },
        data: {
          songs: {
            connect: { id: input.songId },
          },
        },
      });
    }),

  removeFromPlaylist: protectedProcedure
    .input(
      z.object({
        playlistId: z.string(),
        songId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.playlist.update({
        where: {
          id: input.playlistId,
        },
        data: {
          songs: {
            disconnect: { id: input.songId },
          },
        },
      });
    }),
});
