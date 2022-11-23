import DefaultLayout from "../../src/components/DefaultLayout";
import dynamic from 'next/dynamic'
import { useRouter } from "next/router";
const Editor = dynamic(() => import('../../src/Codemirror'), {
    ssr: false,
})
export default function Room() {
    const router = useRouter()
    return (
        <DefaultLayout title="Editor - ComuDEV">
            <Editor roomId={router.query.id} />
        </DefaultLayout>
    )
}