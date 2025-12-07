import { SmallCard } from "@/assets/icons/smartCard";
import Images from "../utils/images";
import color from "@/themes/app.colors";
import { Driving, Wallet } from "@/utils/icons";
import React from "react";
import { SmartCar } from "@/assets/icons/smartCar";

export const slides = [
  {
    id: 0,
    image: Images.destination,
    text: "Choose Your Destination",
    description: "First choose your destination where you want to go!",
  },
  {
    id: 1,
    image: Images.trip,
    text: "Wait for your driver",
    description: "Just wait for a while now until your driver is picking you!",
  },
  {
    id: 2,
    image: Images.bookRide,
    text: "Enjoy Your Trip",
    description:
      "Now enjoy your trip, pay your driver after reaching the destination!",
  },
];

export const rideIcons = [
  <Wallet colors={color.primaryGray} />,
  <Wallet colors={color.primaryGray} />,
  <SmallCard color={color.primaryGray} />,
  <Wallet colors={color.primaryGray} />,
  <SmallCard color={color.primaryGray} />,
  <SmallCard color={color.primaryGray} />,

];

export const recentRidesData: recentRidesTypes[] = [
  {
    id: "1",
    user: "Shahriar Sajeeb",
    rating: "5",
    charge: "2000",
    earnings: "1700",
    share: "300",
    pickup: "Green line bus stand, Rajar Bag, Dhaka",
    dropoff: "Banani Road no 11, Block F, Dhaka",
    time: "14 July 01:34 pm",
    distance: "8km",
  },
];