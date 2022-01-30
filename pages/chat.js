import { Box, Text, TextField, Image, Button, Icon } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js'
import { ButtonSendSticker } from '../src/components/ButtonSendSticker'
import Header from '../src/components/Header'

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMyMDI5OCwiZXhwIjoxOTU4ODk2Mjk4fQ.SPL3RmQATWWAzanXELyWelyfuDzH_a3Oxuqzjns7NVQ'
const SUPABASE_URL = 'https://rvdyztarokpgeyqbrzmd.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function escutaMensagensEmTempoReal(adicionaMensagem) {
  return supabaseClient
    .from('mensagens')
    .on('INSERT', (respostaLive) => {
      adicionaMensagem(respostaLive.new)
    })
    .subscribe()
}

export default function ChatPage() {
  const roteamento = useRouter();
  const usuarioLogado = roteamento.query.username
  const [mensagem, setMensagem] = React.useState('')
  const [listaDeMensagens, setListaDeMensagens] = React.useState([])
  
  // useEffect só executa em determinados casos 
  React.useEffect(() => {
    supabaseClient
      .from('mensagens')
      .select('*')
      .order('id', { ascending: false })
      .then(({ data }) => {
        // pega lista de mensagens do backend
        setListaDeMensagens(data)
      })

    const subscription = escutaMensagensEmTempoReal((novaMensagem) => {
      // atualizacao na tela
      setListaDeMensagens((valorAtualDaLista) => {
        return [
          novaMensagem,
          ...valorAtualDaLista,
        ]
      })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])
  
  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      de: usuarioLogado,
      texto: novaMensagem,
    }

    supabaseClient
      .from('mensagens')
      .insert([
        mensagem
      ])
      .then(({ data }) => {})

    setMensagem('')
  }

  return (
    <Box
      styleSheet={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundImage: 'url(/bg-colorfull.png)',
          backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
          color: appConfig.theme.colors.neutrals['000']
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[1000],
          height: '100%',
          maxWidth: '95%',
          maxHeight: '95vh',
          padding: '32px',
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.primary[1000],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px',
          }}
        >
        <MessageList mensagens={listaDeMensagens} setListaDeMensagens={setListaDeMensagens}/>
          <Box
            as="form"
            styleSheet={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                const mensagemDigitada = event.target.value
                setMensagem(mensagemDigitada)
              }}
              onKeyPress={(event) => {
                if(event.key === 'Enter'){
                  event.preventDefault()
                  handleNovaMensagem(mensagem)
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[1001],
                marginRight: '12px',
                color: appConfig.theme.colors.primary[1001],
              }}
            />
            <ButtonSendSticker 
              onStickerClick={(sticker) => {
                handleNovaMensagem(':sticker:' + sticker)
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function MessageList(props) {
  function deleteMessage(id) {
    supabaseClient
      .from('mensagens')
      .delete()
      .eq("id", id)
      .then(() => {
        const novaListaDeMensagens = props.mensagens.filter((mensagem) => mensagem.id !== id)
        props.setListaDeMensagens(novaListaDeMensagens);
      }) 
  }

  return (
    <Box
      tag="ul"
      styleSheet={{
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column-reverse',
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: '16px',
      }}
    >
      {props.mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: '5px',
              padding: '5px 10px',
              marginBottom: '12px',
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[1000],
              }
            }}
          >
          <Box
            styleSheet={{
              marginBottom: '8px',
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              styleSheet={{
                marginBottom: '8px',
                display: "flex",
                alignItems: "center",
              }}
            >
              <Image
                styleSheet={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '8px',
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong">
                {mensagem.de}
              </Text>
              <Text
                styleSheet={{
                  fontSize: '10px',
                  marginLeft: '8px',
                  color: appConfig.theme.colors.neutrals["000"],
                }}
                tag="span"
              >
              {(new Date().toLocaleDateString())}
              </Text>
            </Box>
            <Box
              styleSheet={{
                marginBottom: '8px',
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Icon
                styleSheet={{
                  width: "16px",
                  cursor: "pointer",
                  hover: {
                    backgroundColor: appConfig.theme.colors.primary[1000],
                  },
                }}
                onClick={() => {
                  deleteMessage(mensagem.id);
                }}
                name="FaRegWindowClose"
                variant="tertiary"
                colorVariant="neutral"
              />
            </Box>
          </Box> 
          {mensagem.texto.startsWith(':sticker:')
            ? (
              <Image src={mensagem.texto.replace(':sticker:', '')}/>
            )
            : (
              mensagem.texto
            )
          }
          </Text>
        )
      })}
    </Box>
  )
}


