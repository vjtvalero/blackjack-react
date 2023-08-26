import { ReactElement, useEffect, useMemo, useState } from "react";
import "./Game.css";

const suits = ["Clovers", "Hearts", "Pikes", "Tiles"];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Game() {
  const [cards, setCards] = useState<Array<ReactElement>>([]);
  const [dealerCards, setDealerCards] = useState<Array<ReactElement>>([]);

  const [cardData, setCardData] = useState<CardProps[]>([]);
  const [dealerCardData, setDealerCardData] = useState<CardProps[]>([]);

  const [gameOver, setGameOver] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [stand, setStand] = useState<boolean>(false);
  const [dealerStand, setDealerStand] = useState<boolean>(false);

  const hit = () => {
    const randomNumber = Math.floor(Math.random() * 13) + 1;
    const randomIndex = Math.floor(Math.random() * suits.length);
    const randomSuit = suits[randomIndex];

    setCards((prev) => [
      ...prev,
      <Card
        key={`${randomSuit}-${randomNumber}`}
        suit={randomSuit}
        number={String(randomNumber)}
      />,
    ]);

    setCardData((prev) => [
      ...prev,
      { suit: randomSuit, number: randomNumber.toString() },
    ]);
  };

  const hitDealer = () => {
    const randomNumber = Math.floor(Math.random() * 13) + 1;
    const randomIndex = Math.floor(Math.random() * suits.length);
    const randomSuit = suits[randomIndex];

    setDealerCards((prev) => [
      ...prev,
      <Card
        key={`${randomSuit}-${randomNumber}`}
        suit={randomSuit}
        number={String(randomNumber)}
      />,
    ]);

    setDealerCardData((prev) => [
      ...prev,
      { suit: randomSuit, number: randomNumber.toString() },
    ]);
  };

  const newGame = async () => {
    setCards([]);
    setDealerCards([]);
    setCardData([]);
    setDealerCardData([]);
    setGameOver(false);
    setResult("");

    setStand(false);
    setDealerStand(false);

    hit();
    await sleep(500);
    hitDealer();
    await sleep(500);
    hitDealer();
  };

  const points = useMemo(() => {
    return cardData.reduce((prev, curr) => {
      let num = Number(curr.number);
      if (num > 10) {
        num = 10;
      }
      return prev + num;
    }, 0);
  }, [cards]);

  const dealerPoints = useMemo(() => {
    return dealerCardData.reduce((prev, curr) => {
      let num = Number(curr.number);
      if (num > 10) {
        num = 10;
      }
      return prev + num;
    }, 0);
  }, [dealerCards]);

  useEffect(() => {
    if (gameOver) {
      return;
    }

    if (points === 21) {
      setGameOver(true);
      setResult("Blackjack!");
      return;
    } else if (points > 21) {
      setGameOver(true);
      setResult("You busted!");
      return;
    }

    if (dealerPoints === 21) {
      setGameOver(true);
      setResult("Dealer Blackjack! You lose.");
      return;
    } else if (dealerPoints > 21) {
      setGameOver(true);
      setResult("Dealer busted! You win.");
      return;
    }

    if (stand) {
      if (dealerPoints >= 17) {
        setDealerStand(true);
      } else {
        hitDealer();
      }

      if (dealerStand) {
        if (dealerPoints > points) {
          setGameOver(true);
          setResult("You lose!");
        } else if (points > dealerPoints) {
          setGameOver(true);
          setResult("You win!");
        } else {
          setGameOver(true);
          setResult("Tie!");
        }
      }
    }
  });

  return (
    <div>
      {result ? (
        <div className="row">
          <h2>{result}</h2>
        </div>
      ) : null}
      <div className="scene">
        {dealerPoints > 0 ? (
          <div className="row">Dealer: {dealerPoints}</div>
        ) : null}
        <div className="row">{dealerCards}</div>

        <div className="divider"></div>

        {points > 0 ? <div className="row">You: {points}</div> : null}
        <div className="row">{cards}</div>
      </div>

      <div className="divider"></div>

      {cards.length && !gameOver ? (
        <div className="row">
          <button onClick={hit}>Hit!</button>
          <button onClick={() => setStand(true)}>Stand</button>
        </div>
      ) : (
        <button onClick={newGame}>New game</button>
      )}
    </div>
  );

  /**
   * Components
   */

  function Card({ suit, number }: CardProps) {
    return (
      <div className="card-container">
        <img src={`./images/cards/${suit}_${number}_white.png`} width={120} />
      </div>
    );
  }

  /**
   * Types
   */
  interface CardProps {
    suit: string;
    number: string;
  }
}
