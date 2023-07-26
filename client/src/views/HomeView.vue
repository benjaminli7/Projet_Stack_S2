<script setup>
import { Button } from "flowbite-vue";
</script>

<template>
  <div class="relative h-[80vh]">

    <div class="container absolute flex flex-col items-center justify-center gap-4 mx-auto transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 ">
      <h1 class="font-bold text-center">Bienvenue sur ChallengeGuessr !</h1>
      <p class="text-center">
        Plongez dans une aventure palpitante où vous allez parcourir le monde sans
        quitter le confort de votre fauteuil. Le principe est simple : nous vous
        larguons dans un endroit aléatoire de la planète, grâce aux images
        captivantes de Google Street View, et c'est à vous de deviner où vous vous
        trouvez !
      </p>
      <p class="text-center">
        Explorez des paysages époustouflants, des villes exotiques et des lieux
        emblématiques. Observez les indices subtils dans les rues, les panneaux de
        signalisation et l'architecture environnante pour affiner votre
        estimation. Plus vous êtes proche de la destination exacte, plus vous
        gagnez de points.
      </p>
      <p class="text-center">
        Êtes-vous prêt à devenir un véritable explorateur et à tester vos
        connaissances géographiques ? Lancez-vous dans cette expérience unique et
        stimulante dès maintenant ! Que l'aventure commence !
      </p>
      <router-link to="/multiplayer">
        <Button color="default">Jouer</Button>
      </router-link>
    </div>
  </div>
</template>
