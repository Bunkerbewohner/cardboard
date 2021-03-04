/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, StatusBar} from 'react-native';

import {CardboardData, loadCardboard} from './model/CardboardData';
import Cardboard from './components/Cardboard';

declare const global: {HermesInternal: null | {}};

const App = () => {
  const [board, setBoard] = useState<CardboardData | null>(null);

  useEffect(() => {
    (async () => {
      const b = await loadCardboard(
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
