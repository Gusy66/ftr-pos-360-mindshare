import { ApolloClient, HttpLink, ApolloLink, InMemoryCache } from "@apollo/client"
import { SetContextLink } from "@apollo/client/link/context"


const httpLink = new HttpLink({
  uri: import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/graphql",
})

const getToken = () => {
  if (typeof window === "undefined") return null
  const stored = window.localStorage.getItem("auth-storage")
  if (!stored) return null
  try {
    const parsed = JSON.parse(stored)
    return parsed?.state?.token ?? null
  } catch {
    return null
  }
}

const authLink = new SetContextLink((prevContext) => {
  const token = getToken()
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache()
})
