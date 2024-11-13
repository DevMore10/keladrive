import { ConvexError, v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { getUser } from "./users";
import { fileTypes } from "./schema";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("you must be logged in to upload a file");
  }
  return await ctx.storage.generateUploadUrl();
});

async function hasAccessToOrg(ctx: QueryCtx | MutationCtx, tokenIdentifier: string, orgId: string) {
  const user = await getUser(ctx, tokenIdentifier);

  const hasAccess = user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);
  // console.log(hasAccess);

  if (!hasAccess) {
    throw new ConvexError("You do not have access to this org");
  }

  return hasAccess;
}

export const createFile = mutation({
  args: {
    name: v.string(),
    fileId: v.id("_storage"),
    orgId: v.string(),
    type:fileTypes
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("you must be logged in to upload a file");
    }
    console.log(identity);

    const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId);

    await ctx.db.insert("files", {
      name: args.name,
      orgId: args.orgId,
      fileId: args.fileId,
      type: args.type
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId);

    if (!hasAccess) {
      return [];
    }

    let files = await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();

      const filesWithUrl = await Promise.all(
        files.map(async (file) => ({
          ...file,
          url: await ctx.storage.getUrl(file.fileId),
        }))
      );
  
      return filesWithUrl;
      
  },
});

export const deleteFile = mutation({
  args: {
    fileId: v.id("files"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("you must be logged in to upload a file");
    }
    console.log(identity);

    const file = await ctx.db.get(args.fileId);

    if (!file) {
      throw new ConvexError("This File does not exist");
    }

    const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, file.orgId!);
    if (!hasAccess) {
      throw new ConvexError("You do not have access to this File");
    }

    await ctx.db.delete(args.fileId);
  },
});
