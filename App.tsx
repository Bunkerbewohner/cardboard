import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, StatusBar} from 'react-native';

import {CardboardData} from './model/CardboardData';
import Cardboard from './components/Cardboard';
import {PlainFiles} from './model/backends/PlainFiles';

declare const global: {HermesInternal: null | {}};

const backend = new PlainFiles();

const App = () => {
  const [board, setBoard] = useState<CardboardData | null>(null);

  useEffect(() => {
    (async () => {
      const b = await backend.loadCardboard(
        '/Users/mathias/Code/cardboard/data/simple_board',
      );
      console.log(`Loaded board ${b.boardName}`);
      setBoard(b);
    })();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        {(board && <Cardboard board={board} />) || <Text>Loading...</Text>}
      </SafeAreaView>
    </>
  );
};

export default App;
