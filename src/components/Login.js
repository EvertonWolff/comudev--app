import { useState } from "react"
import {
    Center,
    Box,
    Text,
    Input,
    Button,
    FormControl,
    FormLabel,
    FormHelperText,
    useToast
} from "@chakra-ui/react"
export default function Login() {

    const [username, setUsername] = useState("")
    const [roomId, setRoomId] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const handleUsernameInputChange = (event) => {
        setUsername(event.target.value)
    }

    const handleRoomIdInputChange = (event) => {
        setRoomId(event.target.value)
    }

    const handleOnSubmit = async (event) => {
        event.preventDefault()
        setIsLoading(true)

        window.localStorage.setItem("username", username)

        try {

            const requestRoomId = await fetch("/api/room", {
                method: "POST",
                body: {
                    username,
                    roomId
                }
            })
            const responseRoomId = requestRoomId.json()
            alert(responseRoomId)
            setIsLoading(false)

        } catch (error) {
            console.log(error)
            setIsLoading(false)

            return toast({
                status: "error",
                title: "Não foi possível iniciar uma sala",
                description: "Pedimos desculpas. Mas não conseguimos iniciar uma sala. Tente mais tarde.",
                isClosable: true
            })

        }
    }
    return (
        <Center>
            <Box shadow="md" display="flex" flexDir="column" gridGap="5" p="10" rounded="md" mt="20">
                <Text as="h1" fontWeight="bold" fontSize="2xl">
                    ComuDEV
                </Text>
                <Text fontWeight="thin">Insira seu nome e o id de uma sala ou deixe em branco para criar uma nova sala.</Text>
                <Box as="form" display="flex" flexDir="column" gridGap="3" onSubmit={handleOnSubmit}>
                    <FormControl>
                        <FormLabel>Seu nome</FormLabel>
                        <Input placeholder="Seu nome" name="username" onChange={handleUsernameInputChange} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>ID da sala</FormLabel>
                        <Input placeholder="ID da sala" name="roomId" onChange={handleRoomIdInputChange} />
                        <FormHelperText>Deixe em branco para criar uma nova</FormHelperText>
                    </FormControl>
                    <Button colorScheme="teal" isLoading={isLoading} onClick={handleOnSubmit}>Começar!</Button>

                </Box>
            </Box>
        </Center>

    )
}