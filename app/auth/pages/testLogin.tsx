import { useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { TestLoginForm } from "app/auth/components/TestLoginForm"

const TestLoginPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <div>
      <TestLoginForm onSuccess={() => router.push(Routes.Home())} />
    </div>
  )
}

TestLoginPage.redirectAuthenticatedTo = "/"
TestLoginPage.getLayout = (page) => <Layout title="Test login">{page}</Layout>

export default TestLoginPage
