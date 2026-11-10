import { useState } from 'react';

import {
  Image,
  Platform,
  StyleSheet,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import {
  Body,
  Button,
  Card,
  ErrorMessage,
} from './ui';

import { theme } from '../theme';

const LIMITE_BYTES = 2 * 1024 * 1024;

type Props = {
  foto: string | null;
  onChange: (foto: string | null) => void;
  disabled?: boolean;
};

export function FotoRegistro({
  foto,
  onChange,
  disabled = false,
}: Props) {
  const [erro, setErro] = useState('');

  async function selecionarFoto() {
    if (disabled) return;

    setErro('');

    try {
      const resultado =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsMultipleSelection: false,
          allowsEditing: false,
          base64: true,
          quality: 0.5,
        });

      if (resultado.canceled) return;

      const imagem = resultado.assets[0];

      if (!imagem?.base64) {
        setErro(
          'Não foi possível ler a imagem. Escolha outra foto.',
        );
        return;
      }

      const base64 = imagem.base64;

      const padding = base64.endsWith('==')
        ? 2
        : base64.endsWith('=')
          ? 1
          : 0;

      const tamanhoBytes =
        Math.floor((base64.length * 3) / 4) - padding;

      if (tamanhoBytes > LIMITE_BYTES) {
        setErro(
          'A foto ultrapassa 2 MB após o processamento. Escolha uma imagem menor.',
        );
        return;
      }

      const mimeType =
        Platform.OS === 'web'
          ? imagem.mimeType ?? 'image/jpeg'
          : 'image/jpeg';

      const fotoSalva =
        Platform.OS === 'web' &&
        imagem.uri.startsWith('data:')
          ? imagem.uri
          : `data:${mimeType};base64,${base64}`;

      onChange(fotoSalva);
    } catch {
      setErro(
        'Não foi possível selecionar a foto. Tente novamente.',
      );
    }
  }

  function removerFoto() {
    setErro('');
    onChange(null);
  }

  return (
    <Card>
      <Body>Foto da barreira — opcional</Body>

      <Body>
        Use uma imagem fictícia, sem rostos, documentos
        ou informações pessoais. Limite de 2 MB.
      </Body>

      {foto ? (
        <>
          <Image
            source={{ uri: foto }}
            accessibilityLabel="Prévia da foto anexada ao relato"
            resizeMode="contain"
            style={styles.photo}
            onError={() =>
              setErro(
                'Não foi possível exibir a foto. Remova-a ou escolha outra imagem.',
              )
            }
          />

          <Button
            title="Remover foto"
            secondary
            disabled={disabled}
            onPress={removerFoto}
          />
        </>
      ) : null}

      <Button
        title={foto ? 'Trocar foto' : 'Selecionar foto'}
        secondary
        disabled={disabled}
        onPress={() => void selecionarFoto()}
      />

      {erro ? <ErrorMessage message={erro} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  photo: {
    width: '100%',
    height: theme.sizes.photoHeight,
    borderRadius: theme.radius.small,
    backgroundColor: theme.colors.background,
  },
});