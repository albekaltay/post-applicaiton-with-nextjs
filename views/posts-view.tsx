"use client";
import { useState, Suspense } from "react";
import Post from "@/components/post";
import AppContainer from "@/layout/app-container";
import PostSkeleton from "@/components/skeletons/post-skeleton";
import { IPost } from "@/types/types";
import {
  useGetPostsQuery,
  useGetPostsByTagQuery,
} from "@/store/services/postApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from "next/dynamic";
import Loading from "@/components/ui/loading";

// ----------------------------------------------------------------------------

const HomeTopBar = dynamic(() => import("@/components/home-top-bar"), {
  loading: () => {
  return <Loading />
  }
});

const DynamicPagination = dynamic(() => import("@/components/ui/pagination").then(mod => mod.Pagination), {
  loading: () => <Loading />
});

const DynamicPaginationContent = dynamic(() => import("@/components/ui/pagination").then(mod => mod.PaginationContent));
const DynamicPaginationItem = dynamic(() => import("@/components/ui/pagination").then(mod => mod.PaginationItem));
const DynamicPaginationLink = dynamic(() => import("@/components/ui/pagination").then(mod => mod.PaginationLink));
const DynamicPaginationNext = dynamic(() => import("@/components/ui/pagination").then(mod => mod.PaginationNext));
const DynamicPaginationPrevious = dynamic(() => import("@/components/ui/pagination").then(mod => mod.PaginationPrevious));
const DynamicPaginationEllipsis = dynamic(() => import("@/components/ui/pagination").then(mod => mod.PaginationEllipsis));

const PostsView = () => {
  return (
    <Suspense fallback={<Loading />}>
      <PostsContent />
    </Suspense>
  );
};

const PostsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get('page');
    return page ? parseInt(page) : 1;
  });

  const [selecetedCategory, setSelectedCategory] = useState<string | undefined>(() => {
    return searchParams.get('category') || undefined;
  });

  const pageSize = 10;

  const [sortConfig, setSortConfig] = useState<{
    sortBy?: string;
    order?: 'asc' | 'desc';
  }>(() => {
    return {
      sortBy: searchParams.get('sortBy') || undefined,
      order: (searchParams.get('order') as 'asc' | 'desc') || undefined
    };
  });

  const { data: allPosts, isLoading: allPostsLoading, isFetching: allPostsFetching , refetch: refetchAllPosts } = useGetPostsQuery({
    limit: pageSize,
    skip: (currentPage - 1) * pageSize,
    sortBy: sortConfig.sortBy,
    order: sortConfig.order
  });

  const { data: postsByTag, isLoading: postsByTagLoading, isFetching: postsByTagFetching } =
    useGetPostsByTagQuery(
      selecetedCategory 
        ? {
            tag: selecetedCategory,
            limit: pageSize,
            skip: (currentPage - 1) * pageSize,
            sortBy: sortConfig.sortBy,
            order: sortConfig.order
          }
        : skipToken
    );

  const displayPosts = selecetedCategory ? postsByTag?.posts : allPosts?.posts;
  const isLoading = selecetedCategory 
    ? (postsByTagLoading || postsByTagFetching) 
    : (allPostsLoading || allPostsFetching);

  const totalPages = selecetedCategory 
    ? postsByTag ? Math.ceil(postsByTag.total / pageSize) : 0
    : allPosts ? Math.ceil(allPosts.total / pageSize) : 0;

  const handleReset = () => {
    setSelectedCategory(undefined);
    setSortConfig({ sortBy: undefined, order: undefined });
    setCurrentPage(1);
    router.push('?page=1');
  };

  const handleSelectedCategory = (name: string) => {
    setSelectedCategory(name);
    setCurrentPage(1);
    router.push(`?category=${name}&page=1`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const category = searchParams.get('category');
    if (category) {
      router.push(`?category=${category}&page=${page}`);
    } else {
      router.push(`?page=${page}`);
    }
  };

  const handleSort = (sortBy: string, order: 'asc' | 'desc') => {
    setSortConfig({ sortBy, order });
    setCurrentPage(1);
    
    const queryParams = new URLSearchParams(searchParams.toString());
    queryParams.set('page', '1');
    queryParams.set('sortBy', sortBy);
    queryParams.set('order', order);
    
    router.push(`?${queryParams.toString()}`);
  };

  return (
    <AppContainer isController={false}>
      {isLoading ? (
        [...Array(10)].map((_, index: number) => <PostSkeleton key={index} />)
      ) : (
        <div className="flex flex-col gap-3">
          <HomeTopBar
            onSelectedCategory={handleSelectedCategory}
            onReset={handleReset}
            onSort={handleSort}
          />

          {displayPosts?.length === 0 ? (
            <div>No Data Found.</div>
          ) : (
            displayPosts?.map((item: IPost) => (
              <Post
                key={item.id}
                id={item.id}
                title={item.title}
                body={item.body}
                likes={item.reactions.likes}
                dislikes={item.reactions.dislikes}
                views={item.views}
              />
            ))
          )}

          <DynamicPagination>
            <DynamicPaginationContent>
              <DynamicPaginationItem>
                <DynamicPaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)}
                  aria-disabled={currentPage === 1 || isLoading}
                  className={currentPage === 1 || isLoading ? "pointer-events-none opacity-50" : ""}
                />
              </DynamicPaginationItem>

              <DynamicPaginationItem>
                <DynamicPaginationLink
                  onClick={() => handlePageChange(1)}
                  isActive={currentPage === 1}
                  className={isLoading ? "pointer-events-none opacity-50" : ""}
                >
                  1
                </DynamicPaginationLink>
              </DynamicPaginationItem>

              {currentPage > 5 && <DynamicPaginationEllipsis />}

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  if (page === 1 || page === totalPages) return false;
                  return Math.abs(currentPage - page) <= 3;
                })
                .map(page => (
                  <DynamicPaginationItem key={page}>
                    <DynamicPaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className={isLoading ? "pointer-events-none opacity-50" : ""}
                    >
                      {page}
                    </DynamicPaginationLink>
                  </DynamicPaginationItem>
                ))}

              {currentPage < totalPages - 4 && <DynamicPaginationEllipsis />}

              {totalPages > 1 && (
                <DynamicPaginationItem>
                  <DynamicPaginationLink
                    onClick={() => handlePageChange(totalPages)}
                    isActive={currentPage === totalPages}
                    className={isLoading ? "pointer-events-none opacity-50" : ""}
                  >
                    {totalPages}
                  </DynamicPaginationLink>
                </DynamicPaginationItem>
              )}

              <DynamicPaginationItem>
                <DynamicPaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  aria-disabled={currentPage === totalPages || isLoading}
                  className={currentPage === totalPages || isLoading ? "pointer-events-none opacity-50" : ""}
                />
              </DynamicPaginationItem>
            </DynamicPaginationContent>
          </DynamicPagination>
        </div>
      )}
    </AppContainer>
  );
};

export default PostsView;
