import { gql } from "@apollo/client"

export const LIST_TRANSACTIONS = gql`
  query ListTransactions($search: String, $month: Int, $year: Int) {
    listTransactions(search: $search, month: $month, year: $year) {
      id
      title
      amount
      type
      date
      categoryId
      category {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`
