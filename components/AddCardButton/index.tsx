import * as React from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
} from 'react-native';
import {useRef, useState} from 'react';
import Card from '../Card';
import {BucketData} from '../../model/CardboardData';
import CardboardState from '../../model/CardboardState';

interface Props {
  bucket: BucketData;
}

const AddCardButton = ({bucket}: Props) => {
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState('');
  const inputRef = useRef<TextInput>(null);

  const onBlur = () => {
    setActive(false);
  };

  const onKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    // TODO: Currently doesn't work on macOS at least because Escape doesn't trigger
    // this event.
    if (e.nativeEvent.key === 'Escape') {
      setActive(false);
    } else if (e.nativeEvent.key === 'Enter') {
      e.stopPropagation();
      onSubmit();
    }
  };

  const onChangeText = (text: string) => {
    if (!text.endsWith('\n')) {
      setLabel(text);
    }
  };

  const onSubmit = () => {
    if (label.trim()) {
      CardboardState.addCard(bucket.id, label);

      setLabel('');
      // add another card
      setTimeout(() => {
        inputRef.current?.focus();
      });
    } else {
      setActive(false);
    }
  };

  if (active) {
    return (
      <Card card={undefined} bucket={bucket}>
        <TextInput
          ref={inputRef}
          autoFocus={true}
          multiline={true}
          textAlignVertical={'top'}
          enablesReturnKeyAutomatically={true}
          autoCorrect={true}
          value={label}
          onBlur={onBlur}
          blurOnSubmit={false}
          onSubmitEditing={onSubmit}
          onKeyPress={onKeyPress}
          onChangeText={onChangeText}
          placeholder={'enter text...'}
        />
      </Card>
    );
  } else {
    return (
      <TouchableOpacity style={styles.root} onPress={() => setActive(true)}>
        <Text style={styles.label}>add card</Text>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  root: {
    margin: 5,
  },
  label: {
    paddingVertical: 2,
    paddingHorizontal: 2,
    color: '#888',
  },
});

export default AddCardButton;
