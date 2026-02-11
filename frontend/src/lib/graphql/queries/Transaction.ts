import { gql } from "@apollo/client"

export const LIST_TRANSACTIONS = gql`
  query ListTransactions(
    $search: String
    $month: Int
    $year: Int
    $type: String
    $categoryId: String
  ) {
    listTransactions(
      search: $search
      month: $month
      year: $year
      type: $type
      categoryId: $categoryId
    ) {
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
