"use client";
import Post from "@/components/post";
import AppContainer from "@/layout/app-container";
import PostSkeleton from "@/components/skeletons/post-skeleton";
import { IPost } from "@/types/types";
import { useGetPostsQuery } from "@/store/services/postApi";
import Link from "next/link";
import { useAuth } from "@/store/contexts/AuthContext";
import { Button } from "@/components/ui/button";

// ----------------------------------------------------------------------------

const HomeView = () => {
  const { accessToken } = useAuth();

  const { data: allPosts, isLoading: allPostsLoading } = useGetPostsQuery({});

  return (
    <AppContainer isController={false}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Most popular posts from the last 30 posts
          </h1>
          <p className="text-gray-600">
            Discover the most engaging posts from our community.
          </p>
        </div>

        <div className="space-y-6 mb-12">
          {allPostsLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <PostSkeleton key={i} />
              ))}
            </div>
          ) : (
            allPosts?.posts
              ?.slice(0, 2)
              .map((post: IPost) => (
                <Post
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  body={post.body}
                  likes={post.reactions.likes}
                  dislikes={post.reactions.dislikes}
                  views={post.views}
                />
              ))
          )}
        </div>

        {!accessToken ? (
          <div className="bg-gradient-to-r  from-rose-600  to-rose-50 rounded-lg p-8 text-white text-center mb-4">
            <h2 className="text-2xl font-bold mb-4">Ready to Explore?</h2>
            <p className="mb-6">Log in or sign up to start exploring!</p>
            <div className="flex flex-row justify-center gap-2">
              <Link
                href="/auth/login"
                className="bg-white text-rose-600 px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors"
              >
                Let's Start!
              </Link>
              <Link
                href="/posts"
                className="bg-white text-rose-600 px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors"
              >
                See All Posts
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Link href="/posts">
              <Button variant="default" size="lg">
                See All Posts
              </Button>
            </Link>
          </div>
        )}
      </div>
    </AppContainer>
  );
};

export default HomeView;
