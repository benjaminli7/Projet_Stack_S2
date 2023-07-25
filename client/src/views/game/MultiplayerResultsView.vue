<script setup>
import { defineProps, onMounted } from "vue";
let map;
const props = defineProps({
  roomData: {
    type: Object,
    required: true,
  },
  getResultMessage: {
    type: Function,
    required: true,
  },
  currentPlayer: {
    type: String,
    required: true,
  },
  outcome: {
    type: String,
    required: true,
  },
});

onMounted(() => {
  initMap();
});

const initMap = () => {
  map = new google.maps.Map(document.getElementById("result-map"), {
    center: { lat: 0, lng: 0 },
    zoom: 4,
    mapTypeControl: false,
    streetViewControl: false,
    options: {
      gestureHandling: "greedy",
    },
  });
  addMarkers();
  drawDashedLines();
};

const image =
  "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";

const addMarkers = () => {
  props.roomData.positions.map((position) => {
    return new google.maps.Marker({
      position: {
        lat: position.lat,
        lng: position.lng,
      },
      map,
      icon: {
        url: image,
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 32),
      },
    });
  });

  if (props.currentPlayer === "player1") {
    props.roomData.player1_guesses.map((guess, index) => {
      return new google.maps.Marker({
        position: {
          lat: guess.lat,
          lng: guess.lng,
        },
        map,
      });
    });
  } else {
    props.roomData.player2_guesses.map((guess, index) => {
      return new google.maps.Marker({
        position: {
          lat: guess.lat,
          lng: guess.lng,
        },
        map,
      });
    });
  }
};

const drawDashedLines = () => {
  if (props.currentPlayer === "player1") {
    props.roomData.player1_guesses.map((guess, index) => {
      const path = [
        {
          lat: guess.lat,
          lng: guess.lng,
        },
        {
          lat: props.roomData.positions[index].lat,
          lng: props.roomData.positions[index].lng,
        },
      ];

      const line = new google.maps.Polyline({
        path,
        strokeOpacity: 0,
        strokeWeight: 2,
      icons: [
        {
          icon: {
            path: "M 0,-1 0,1",
            strokeOpacity: 1,
            strokeWeight: 2.5,
            scale: 4,
          },
          offset: "0",
          repeat: "20px",
        },
      ],
      });
      line.setMap(map);
    });
  } else {
    props.roomData.player2_guesses.map((guess, index) => {
      const path = [
        {
          lat: guess.lat,
          lng: guess.lng,
        },
        {
          lat: props.roomData.positions[index].lat,
          lng: props.roomData.positions[index].lng,
        },
      ];

      const line = new google.maps.Polyline({
        path,
        strokeOpacity: 0.7,
        strokeWeight: 2,
        icons: [
          {
            icon: {
              path: "M 0,-1 0,1",
              strokeOpacity: 1,
              scale: 4,
            },
            offset: "0",
          },
        ],
      });
      line.setMap(map);
    });
  }
};
</script>

<template>
    <div id="result-map"></div>

    <h2>{{ props.getResultMessage() }}</h2>
</template>

<style scoped>
#result-map {
  height: 100vh;
  /* width: 100vw; */
}
</style>
