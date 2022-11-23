import dynamic from 'next/dynamic'
const Login = dynamic(() => import('../src/components/Login'), {
  ssr: false,
})
export default function Portal() {
  return (
    <Login />
  )
}