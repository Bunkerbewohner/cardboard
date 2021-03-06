import React from 'react';
import {SafeAreaView, Text, StatusBar} from 'react-native';

import Cardboard from './components/Cardboard';
import CardboardState from './model/CardboardState';
import {observer} from 'mobx-react';

declare const global: {HermesInternal: null | {}};

CardboardState.loadCardboard('/Users/mathias/Code/cardboard/data/simple_board');

const App = observer(() => {
  const board = CardboardState.cardboard;

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        {(board && <Cardboard board={board} />) || <Text>Loading...</Text>}
      </SafeAreaView>
    </>
  );
});

export default App;
