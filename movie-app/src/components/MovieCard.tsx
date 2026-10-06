import React from "react";

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  MovieCardProps,
} from "../types/movie";

function MovieCard({
  movie,
  layout = "row",
  onSelect,
}: MovieCardProps) {
  const isTile = layout === "tile";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onSelect(movie.id)}
      style={[
        styles.card,
        isTile && styles.cardTile,
      ]}
    >
      <View
        style={[
          styles.posterContainer,
          isTile &&
            styles.posterContainerTile,
        ]}
      >
        <Image
          source={{
            uri: movie.poster,
          }}
          style={[
            styles.poster,
            isTile && styles.posterTile,
          ]}
          resizeMode="cover"
        />

        {isTile && (
          <View style={styles.ratingOverlay}>
            <Text
              style={
                styles.ratingOverlayText
              }
            >
              ⭐ {movie.rating.toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      <View
        style={[
          styles.info,
          isTile && styles.infoTile,
        ]}
      >
        <Text
          style={[
            styles.title,
            isTile && styles.titleTile,
          ]}
          numberOfLines={
            isTile ? 1 : 2
          }
        >
          {movie.title}
        </Text>

        {!isTile && (
          <Text
            style={styles.genre}
            numberOfLines={1}
          >
            Thể loại: {movie.genre}
          </Text>
        )}

        {!isTile && (
          <Text style={styles.year}>
            Năm: {movie.year}
          </Text>
        )}

        {!isTile && (
          <Text style={styles.rating}>
            ⭐ {movie.rating.toFixed(1)}
          </Text>
        )}

        <Text style={styles.status}>
          {movie.isWatched
            ? "Đã xem ✅"
            : "Chưa xem ⏳"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(MovieCard);

const styles = StyleSheet.create({
  card: {
    width: "100%",

    flexDirection: "row",

    backgroundColor: "#FFFFFF",

    borderRadius: 14,

    padding: 12,

    marginBottom: 12,

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,

    shadowRadius: 5,

    elevation: 3,
  },

  cardTile: {
    width: "48%",

    flexDirection: "column",

    padding: 8,

    marginBottom: 12,
  },

  posterContainer: {
    width: 70,

    height: 100,

    position: "relative",
  },

  posterContainerTile: {
    width: "100%",

    height: undefined,

    aspectRatio: 2 / 3,
  },

  poster: {
    width: 70,

    height: 100,

    borderRadius: 8,

    backgroundColor: "#E5E7EB",
  },

  posterTile: {
    width: "100%",

    height: "100%",

    borderRadius: 8,
  },

  ratingOverlay: {
    position: "absolute",

    top: 6,

    right: 6,

    backgroundColor:
      "rgba(0, 0, 0, 0.75)",

    borderRadius: 8,

    paddingHorizontal: 7,

    paddingVertical: 4,
  },

  ratingOverlayText: {
    color: "#FFFFFF",

    fontSize: 11,

    fontWeight: "700",
  },

  info: {
    flex: 1,

    marginLeft: 12,

    justifyContent: "space-between",
  },

  infoTile: {
    marginLeft: 0,

    marginTop: 8,
  },

  title: {
    fontSize: 16,

    fontWeight: "700",

    color: "#111827",

    marginBottom: 5,
  },

  titleTile: {
    fontSize: 14,

    marginBottom: 5,
  },

  genre: {
    fontSize: 13,

    color: "#6B7280",

    marginBottom: 4,
  },

  year: {
    fontSize: 13,

    color: "#6B7280",

    marginBottom: 5,
  },

  rating: {
    fontSize: 14,

    fontWeight: "700",

    color: "#D97706",

    marginBottom: 4,
  },

  status: {
    fontSize: 13,

    fontWeight: "600",

    color: "#374151",
  },
});