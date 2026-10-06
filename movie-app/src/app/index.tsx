import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import MovieCard from "../components/MovieCard";

import {
  Movie,
} from "../types/movie";

import {
  API_URL,
} from "../constants/api";

const PAGE_LIMIT = 10;

export default function HomeScreen() {
  const [movies, setMovies] =
    useState<Movie[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [isTile, setIsTile] =
    useState(false);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [hasMore, setHasMore] =
    useState(true);

  const [pageError, setPageError] =
    useState(false);

  const [failedPage, setFailedPage] =
    useState<number | null>(null);

  const pageRef = useRef(1);

  const loadingRef = useRef(false);

  const hasMoreRef = useRef(true);

  const refreshRef = useRef(false);

  const fetchPage = useCallback(
    async (
      page: number,
      isRefresh: boolean = false
    ) => {
      if (
        loadingRef.current &&
        !isRefresh
      ) {
        return;
      }

      if (
        !isRefresh &&
        !hasMoreRef.current
      ) {
        return;
      }

      loadingRef.current = true;

      setPageError(false);

      if (isRefresh) {
        setRefreshing(true);
      } else if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const response =
          await fetch(
            `${API_URL}?page=${page}&limit=${PAGE_LIMIT}`
          );

        if (!response.ok) {
          throw new Error(
            "Không thể tải dữ liệu."
          );
        }

        const data: Movie[] =
          await response.json();

        setMovies(
          (currentMovies) => {
            if (
              isRefresh ||
              page === 1
            ) {
              const uniqueMovies =
                data.filter(
                  (
                    movie,
                    index,
                    array
                  ) =>
                    array.findIndex(
                      (item) =>
                        item.id ===
                        movie.id
                    ) === index
                );

              return uniqueMovies;
            }

            const combinedMovies = [
              ...currentMovies,
              ...data,
            ];

            const uniqueMovies =
              combinedMovies.filter(
                (
                  movie,
                  index,
                  array
                ) =>
                  array.findIndex(
                    (item) =>
                      item.id ===
                      movie.id
                  ) === index
              );

            return uniqueMovies;
          }
        );

        pageRef.current = page;

        const more =
          data.length ===
          PAGE_LIMIT;

        hasMoreRef.current =
          more;

        setHasMore(more);

        setFailedPage(null);
      } catch (error) {
        setPageError(true);

        setFailedPage(page);
      } finally {
        loadingRef.current =
          false;

        setLoading(false);

        setLoadingMore(false);

        setRefreshing(false);

        refreshRef.current =
          false;
      }
    },
    []
  );

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const handleSelectMovie =
    (id: string) => {
      const movie = movies.find(
        (item) => item.id === id
      );

      if (!movie) {
        return;
      }

      Alert.alert(
        movie.title,
        `${movie.title} (${movie.year})`
      );
    };

  const handleLoadMore =
    () => {
      if (loadingRef.current) {
        return;
      }

      if (!hasMoreRef.current) {
        return;
      }

      const nextPage =
        pageRef.current + 1;

      fetchPage(nextPage);
    };

  const handleRefresh =
    async () => {
      if (refreshRef.current) {
        return;
      }

      refreshRef.current = true;

      pageRef.current = 1;

      hasMoreRef.current = true;

      setHasMore(true);

      setPageError(false);

      setFailedPage(null);

      await fetchPage(
        1,
        true
      );
    };

  const handleRetry = () => {
    if (
      failedPage === null
    ) {
      return;
    }

    fetchPage(failedPage);
  };

  const numColumns = isTile
    ? 2
    : 1;

  if (loading) {
    return (
      <SafeAreaView
        style={
          styles.loadingContainer
        }
      >
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text
          style={styles.loadingText}
        >
          Đang tải danh sách phim...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={[
        "top",
        "left",
        "right",
      ]}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <Text
          style={styles.headerTitle}
        >
          Movie App
        </Text>

        <View
          style={
            styles.switchContainer
          }
        >
          <Text
            style={styles.switchText}
          >
            Dạng lưới
          </Text>

          <Switch
            value={isTile}
            onValueChange={
              setIsTile
            }
            trackColor={{
              false: "#CBD5E1",
              true: "#93C5FD",
            }}
            thumbColor={
              isTile
                ? "#2563EB"
                : "#FFFFFF"
            }
          />
        </View>
      </View>

      {/* DANH SÁCH */}

      <View style={styles.content}>
        <FlatList
          key={String(numColumns)}

          data={movies}

          numColumns={numColumns}

          keyExtractor={(item) =>
            item.id
          }

          renderItem={({
            item,
          }) => (
            <MovieCard
              movie={item}
              layout={
                isTile
                  ? "tile"
                  : "row"
              }
              onSelect={
                handleSelectMovie
              }
            />
          )}

          columnWrapperStyle={
            isTile
              ? styles.columnWrapper
              : undefined
          }

          contentContainerStyle={
            styles.listContent
          }

          showsVerticalScrollIndicator={
            false
          }

          onEndReached={
            handleLoadMore
          }

          onEndReachedThreshold={
            0.5
          }

          refreshControl={
            <RefreshControl
              refreshing={
                refreshing
              }
              onRefresh={
                handleRefresh
              }
              colors={[
                "#2563EB",
              ]}
              tintColor="#2563EB"
            />
          }

          ListFooterComponent={
            <View
              style={
                styles.footer
              }
            >
              {loadingMore && (
                <>
                  <ActivityIndicator
                    size="small"
                    color="#2563EB"
                  />

                  <Text
                    style={
                      styles.footerText
                    }
                  >
                    Đang tải thêm...
                  </Text>
                </>
              )}

              {!loadingMore &&
                pageError && (
                  <View
                    style={
                      styles.errorContainer
                    }
                  >
                    <Text
                      style={
                        styles.errorText
                      }
                    >
                      Tải thất bại
                    </Text>

                    <TouchableOpacity
                      style={
                        styles.retryButton
                      }
                      onPress={
                        handleRetry
                      }
                    >
                      <Text
                        style={
                          styles.retryButtonText
                        }
                      >
                        Thử lại
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

              {!loadingMore &&
                !pageError &&
                !hasMore &&
                movies.length >
                  0 && (
                  <Text
                    style={
                      styles.endText
                    }
                  >
                    — Đã hết danh sách —
                  </Text>
                )}
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#F3F4F6",
  },

  loadingContainer: {
    flex: 1,

    backgroundColor: "#F3F4F6",

    justifyContent: "center",

    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,

    fontSize: 16,

    color: "#374151",

    fontWeight: "500",
  },

  header: {
    minHeight: 64,

    paddingHorizontal: 16,

    backgroundColor: "#1E3A8A",

    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",
  },

  headerTitle: {
    color: "#FFFFFF",

    fontSize: 23,

    fontWeight: "800",
  },

  switchContainer: {
    flexDirection: "row",

    alignItems: "center",
  },

  switchText: {
    color: "#FFFFFF",

    fontSize: 14,

    fontWeight: "600",

    marginRight: 8,
  },

  content: {
    flex: 1,

    paddingHorizontal: 12,
  },

  listContent: {
    paddingTop: 12,

    paddingBottom: 20,
  },

  columnWrapper: {
    justifyContent:
      "space-between",
  },

  footer: {
    minHeight: 60,

    justifyContent: "center",

    alignItems: "center",

    paddingVertical: 12,
  },

  footerText: {
    marginTop: 6,

    fontSize: 13,

    color: "#6B7280",
  },

  endText: {
    fontSize: 13,

    color: "#9CA3AF",

    fontWeight: "500",
  },

  errorContainer: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 10,
  },

  errorText: {
    color: "#DC2626",

    fontSize: 14,

    fontWeight: "600",
  },

  retryButton: {
    backgroundColor: "#2563EB",

    paddingHorizontal: 14,

    paddingVertical: 8,

    borderRadius: 8,
  },

  retryButtonText: {
    color: "#FFFFFF",

    fontSize: 13,

    fontWeight: "700",
  },
});