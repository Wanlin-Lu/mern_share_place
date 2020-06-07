import React from 'react'

import UsersList from '../components/UsersList'

const USERS = [
  {
    id: "u1",
    name: "Zhao Jianye",
    image:
      'https://i1.hdslb.com/bfs/face/32c29e460aaaee403b38296bd492c8ee8e025590.jpg',
    places: 3
  },
];

const Users = () => {
  return (
    <UsersList items={USERS} />
  )
}

export default Users