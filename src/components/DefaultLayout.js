import { Box, Text, Grid, GridItem } from "@chakra-ui/react"
import Head from "next/head"

export default function DefaultLayout({ title, children }) {
    return (
        <Box display="flex" flexDir="column">
            <Head>
                <title></title>
            </Head>
            <Box display="flex" flexDir="row" p="4" backgroundColor="blackAlpha.100">
                <Grid templateRows={2} gap={6}>
                    <GridItem>
                        <Text fontWeight="bold" fontSize="xl">ComuDEV-APP</Text>
                    </GridItem>
                    <GridItem>
                        <Text fontSize="x6">Para Comunidade Brasileira de Desenvolvimento Web</Text>
                    </GridItem>
                </Grid>
            </Box>
            <Box>
                {children}
            </Box>
        </Box>
    )
}