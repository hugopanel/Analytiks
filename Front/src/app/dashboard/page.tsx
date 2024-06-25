"use client";

import {
  Book,
  Bot,
  Code2,
  LifeBuoy,
  SignalLow,
  SignalMedium,
  SignalHigh,
  Settings,
  Settings2,
  Share,
  SquareTerminal,
  SquareUser,
  Gamepad2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multiselector";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Dashboard() {
  // CONSTANTS
  const predictionsList: any[] | (() => any[]) = [];

  const genresList = [
    "Action",
    "Adventure",
    "Casual",
    "Free to Play",
    "Massively Multiplayer",
    "RPG",
    "Racing",
    "Simulation",
    "Sports",
    "Strategy",
  ];

  const categoriesList = [
    "Cross-Platform Multiplayer",
    "Family Sharing",
    "In-App Purchases",
    "Includes level editor",
    "Online Co-op",
    "Online PvP",
    "Profile Features Limited",
    "Remote Play Together",
    "Remote Play on TV",
    "Shared/Split Screen Co-op",
    "Shared/Split Screen PvP",
    "Single-player",
    "Stats",
    "Steam Achievements",
    "Steam Cloud",
    "Steam Leaderboards",
    "Steam Trading Cards",
    "Steam Workshop",
    "Steam is learning about this game",
    "Tracked Controller Support",
    "VR Only",
  ];

  // STATES
  const [genres, setGenres] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [ageRating, setAgeRating] = useState<boolean>(false);
  const [windows, setWindows] = useState<boolean>(false);
  const [macos, setMacos] = useState<boolean>(false);
  const [linux, setLinux] = useState<boolean>(false);
  const [nbReviews, setNbReviews] = useState<string>("unavoidable");
  const [predictions, setPredictions] = useState(predictionsList);

  // HANDLERS
  const handleAgeRatingClick = () => setAgeRating(!ageRating);
  const handleWindowsClick = () => setWindows(!windows);
  const handleMacosClick = () => setMacos(!macos);
  const handleLinuxClick = () => setLinux(!linux);
  const handleNumberReviewsChange = (value: string) => setNbReviews(value);

  // Submit button onClick
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let nbReviewsValue;
    switch (nbReviews) {
      case "known":
        nbReviewsValue = 0.1;
        break;
      case "talked_about":
        nbReviewsValue = 0.5;
        break;
      default:
        nbReviewsValue = 1;
        break;
    }

    const price = document.getElementById("price") as HTMLInputElement;
    var priceValue = price.value;
    if (priceValue === "") priceValue = "0";

    // Get the selected genres and categories
    var selectedGenres = genresList.map((genre) =>
      genres.indexOf(genre) > -1 ? 1 : 0
    );
    var selectedCategories = categoriesList.map((category) =>
      categories.indexOf(category) > -1 ? 1 : 0
    );

    let body = {
      features: [
        ageRating ? 1 : 0,
        windows,
        macos,
        linux,
        nbReviewsValue,
        ...selectedGenres,
        ...selectedCategories,
        // priceValue as float
        parseFloat(priceValue),
      ],
    };

    // Send post request to the api
    fetch("http://localhost:8000/predict", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      // Get the prediction value from the response
      response.json().then((data) => {
        console.log(data.prediction[0]);
        setPredictions([
          ...predictions,
          {
            number: "#" + (predictions.length + 1),
            number_reviews:
              nbReviews.charAt(0).toUpperCase() + nbReviews.slice(1),
            price: priceValue + "€",
            success: data.prediction[0].toFixed(0) + "%",
          },
        ]);
      });
    });
  };

  return (
    <div className="grid h-screen w-full pl-[56px]">
      {/* SIDE BAR */}
      <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
        <div className="border-b p-2">
          <Button variant="outline" size="icon" aria-label="Home">
            <Gamepad2 className="size-5 fill-foreground" />
          </Button>
        </div>
        <nav className="grid gap-1 p-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg bg-muted"
                  aria-label="Success Predictor"
                >
                  <SquareTerminal className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Success Predictor
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  aria-label="Models"
                >
                  <Bot className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Models
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  aria-label="API"
                >
                  <Code2 className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                API
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  aria-label="Documentation"
                >
                  <Book className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Documentation
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  aria-label="Settings"
                >
                  <Settings2 className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Settings
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto grid gap-1 p-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-auto rounded-lg"
                  aria-label="Help"
                >
                  <LifeBuoy className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Help
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-auto rounded-lg"
                  aria-label="Account"
                >
                  <SquareUser className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Account
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <div className="flex flex-col">
        {/* HEADER */}
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <h1 className="text-xl font-semibold">Success Predictor</h1>
          {/* DRAWER (Content but for mobile screens) */}
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Settings className="size-4" />
                <span className="sr-only">Global Game Settings</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80vh]">
              <DrawerHeader>
                <DrawerTitle>Configuration</DrawerTitle>
                <DrawerDescription>
                  Configure the settings for the game.
                </DrawerDescription>
              </DrawerHeader>
              <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Global Settings
                  </legend>
                  <div className="grid gap-3">
                    <Label htmlFor="nb_reviews">Number of Reviews</Label>
                    <Select>
                      <SelectTrigger
                        id="nb_reviews"
                        className="items-start [&_[data-description]]:hidden"
                      >
                        <SelectValue placeholder="Select a number of reviews" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="known">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <SignalLow className="size-5" />
                            <div className="grid gap-0.5">
                              <span className="font-medium text-foreground">
                                Known
                              </span>
                              <p className="text-xs" data-description>
                                (=0.1) People know about the game but few people
                                left reviews.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="talked_about">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <SignalMedium className="size-5" />
                            <div className="grid gap-0.5">
                              <span className="font-medium text-foreground">
                                Talked about
                              </span>
                              <p className="text-xs" data-description>
                                (=0.5) Your game is talked about and has a lot
                                of reviews.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="unavoidable">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <SignalHigh className="size-5" />
                            <div className="grid gap-0.5">
                              <span className="font-medium text-foreground">
                                Unavoidable
                              </span>
                              <p className="text-xs" data-description>
                                (=1) Your game is in everyone's mouth and has a
                                lot of reviews.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="items-top flex space-x-2">
                    <Checkbox id="age_rating" />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="age_rating"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Has age rating
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        If the game is rated for a specific age group (not
                        necessarily "mature").
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="price">Price (€)</Label>
                    <Input id="price" type="number" placeholder="60" />
                  </div>
                </fieldset>
                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Compatibility
                  </legend>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="windows" />
                    <Label
                      htmlFor="windows"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Windows
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="macos" />
                    <Label
                      htmlFor="macos"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      macOS
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="linux" />
                    <Label
                      htmlFor="linux"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Linux
                    </Label>
                  </div>
                </fieldset>

                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Game style
                  </legend>
                  <div className="grid gap-3">
                    <Label>Genres</Label>
                    <MultiSelector
                      values={genres}
                      onValuesChange={setGenres}
                      loop
                    >
                      <MultiSelectorTrigger>
                        <MultiSelectorInput placeholder="Select the genres" />
                      </MultiSelectorTrigger>
                      <MultiSelectorContent>
                        <MultiSelectorList>
                          <MultiSelectorItem value={"Action"}>
                            Action
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"Adventure"}>
                            Adventure
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"Casual"}>
                            Casual
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"Free to Play"}>
                            Free to Play
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"Massively Multiplayer"}>
                            Massively Multiplayer
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"RPG"}>
                            RPG
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"Racing"}>
                            Racing
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"Simulation"}>
                            Simulation
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"Sports"}>
                            Sports
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"Strategy"}>
                            Strategy
                          </MultiSelectorItem>
                        </MultiSelectorList>
                      </MultiSelectorContent>
                    </MultiSelector>
                  </div>
                  <div className="grid gap-3">
                    <Label>Categories</Label>
                    <MultiSelector
                      values={categories}
                      onValuesChange={setCategories}
                      loop
                    >
                      <MultiSelectorTrigger>
                        <MultiSelectorInput placeholder="Select the categories" />
                      </MultiSelectorTrigger>
                      <MultiSelectorContent>
                        <MultiSelectorList>
                          <MultiSelectorItem
                            value={"Cross-Platform Multiplayer"}
                          >
                            Cross-Platform Multiplayer
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"Family Sharing"}>
                            Family Sharing
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"In-App Purchases"}>
                            In-App Purchases
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"Includes level editor"}>
                            Includes level editor
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"Online Co-op"}>
                            Online Co-op
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"Online PvP"}>
                            Online PvP
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"Profile Features Limited"}>
                            Profile Features Limited
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"Remote Play Together"}>
                            Remote Play Together
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"Remote Play on TV"}>
                            Remote Play on TV
                          </MultiSelectorItem>
                          <MultiSelectorItem
                            value={"Shared/Split Screen Co-op"}
                          >
                            Shared/Split Screen Co-op
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"Shared/Split Screen PvP"}>
                            Shared/Split Screen PvP
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"Single-player"}>
                            Single-player
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"Stats"}>
                            Stats
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"Steam Achievements"}>
                            Steam Achievements
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"Steam Cloud"}>
                            Steam Cloud
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"Steam Leaderboards"}>
                            Steam Leaderboards
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"Steam Trading Cards"}>
                            Steam Trading Cards
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"Steam Workshop"}>
                            Steam Workshop
                          </MultiSelectorItem>
                          <MultiSelectorItem
                            value={"Steam is learning about this game"}
                          >
                            Steam is learning about this game
                          </MultiSelectorItem>
                          <MultiSelectorItem
                            value={"Tracked Controller Support"}
                          >
                            Tracked Controller Support
                          </MultiSelectorItem>
                          <MultiSelectorItem value={"VR Only"}>
                            VR Only
                          </MultiSelectorItem>
                        </MultiSelectorList>
                      </MultiSelectorContent>
                    </MultiSelector>
                  </div>
                </fieldset>
              </form>
            </DrawerContent>
          </Drawer>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-1.5 text-sm"
          >
            <Share className="size-3.5" />
            Share
          </Button>
        </header>

        {/* MAIN */}
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            className="relative hidden flex-col items-start gap-8 md:flex"
            x-chunk="dashboard-03-chunk-0"
          >
            <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Global Settings
                </legend>
                <div className="grid gap-3">
                  <Label htmlFor="nb_reviews">Number of Reviews</Label>
                  <Select
                    onValueChange={handleNumberReviewsChange}
                    defaultValue={nbReviews}
                  >
                    <SelectTrigger
                      id="nb_reviews"
                      className="items-start [&_[data-description]]:hidden"
                    >
                      <SelectValue placeholder="Select a number of reviews" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="known">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <SignalLow className="size-5" />
                          <div className="grid gap-0.5">
                            <span className="font-medium text-foreground">
                              Known
                            </span>
                            <p className="text-xs" data-description>
                              (=0.1) People know about the game but few people
                              left reviews.
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="talked_about">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <SignalMedium className="size-5" />
                          <div className="grid gap-0.5">
                            <span className="font-medium text-foreground">
                              Talked about
                            </span>
                            <p className="text-xs" data-description>
                              (=0.5) Your game is talked about and has a lot of
                              reviews.
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="unavoidable">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <SignalHigh className="size-5" />
                          <div className="grid gap-0.5">
                            <span className="font-medium text-foreground">
                              Unavoidable
                            </span>
                            <p className="text-xs" data-description>
                              (=1) Your game is in everyone's mouth and has a
                              lot of reviews.
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="items-top flex space-x-2">
                  <Checkbox
                    id="age_rating"
                    checked={ageRating}
                    onCheckedChange={handleAgeRatingClick}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="age_rating"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Has age rating
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      If the game is rated for a specific age group (not
                      necessarily "mature").
                    </p>
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="price">Price (€)</Label>
                  <Input id="price" type="number" placeholder="60" />
                </div>
              </fieldset>
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Compatibility
                </legend>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="windows"
                    checked={windows}
                    onCheckedChange={handleWindowsClick}
                  />
                  <Label
                    htmlFor="windows"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Windows
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="macos"
                    checked={macos}
                    onCheckedChange={handleMacosClick}
                  />
                  <Label
                    htmlFor="macos"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    macOS
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="linux"
                    checked={linux}
                    onCheckedChange={handleLinuxClick}
                  />
                  <Label
                    htmlFor="linux"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Linux
                  </Label>
                </div>
              </fieldset>

              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Game style
                </legend>
                <div className="grid gap-3">
                  <Label>Genres</Label>
                  <MultiSelector
                    values={genres}
                    onValuesChange={setGenres}
                    loop
                  >
                    <MultiSelectorTrigger>
                      <MultiSelectorInput placeholder="Select the genres" />
                    </MultiSelectorTrigger>
                    <MultiSelectorContent>
                      <MultiSelectorList>
                        {genresList.map((genre) => (
                          <MultiSelectorItem key={genre} value={genre}>
                            {genre}
                          </MultiSelectorItem>
                        ))}
                      </MultiSelectorList>
                    </MultiSelectorContent>
                  </MultiSelector>
                </div>
                <div className="grid gap-3">
                  <Label>Categories</Label>
                  <MultiSelector
                    values={categories}
                    onValuesChange={setCategories}
                    loop
                  >
                    <MultiSelectorTrigger>
                      <MultiSelectorInput placeholder="Select the categories" />
                    </MultiSelectorTrigger>
                    <MultiSelectorContent>
                      <MultiSelectorList>
                        {categoriesList.map((category) => (
                          <MultiSelectorItem key={category} value={category}>
                            {category}
                          </MultiSelectorItem>
                        ))}
                      </MultiSelectorList>
                    </MultiSelectorContent>
                  </MultiSelector>
                </div>
              </fieldset>
              <Button
                type="submit"
                size="sm"
                className="mx-auto gap-1.5"
                onClick={handleSubmit}
              >
                Predict success
              </Button>
            </form>
          </div>
          <fieldset className="relative h-full lg:col-span-2 grid gap-6 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">Output</legend>
            <Table>
              <TableCaption>List of your recent predictions.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[130px]">Prediction #</TableHead>
                  <TableHead>Nb. of reviews</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Success</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {predictions.map((invoice) => (
                  <TableRow key={invoice.number}>
                    <TableCell className="font-medium">
                      {invoice.number}
                    </TableCell>
                    <TableCell>{invoice.number_reviews}</TableCell>
                    <TableCell>{invoice.price}</TableCell>
                    <TableCell className="text-right">
                      {invoice.success}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </fieldset>
        </main>
      </div>
    </div>
  );
}
