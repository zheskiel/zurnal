import { api } from "./api";

export const getPosts = async ({ page }) => {
  return await api(`GET`, "posts", { query: { page } });
};

export const getPost = async ({ postSlugId, postSlugTitle, page = null }) => {
  let postQuery = {};
  if (page !== null) postQuery.page = page;

  return await api(`GET`, `post/${postSlugId}/${postSlugTitle}`, {
    query: postQuery,
  });
};
