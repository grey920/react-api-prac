import React, { useState } from 'react';
import axios from 'axios';
import { useAsync } from './useAsync';
import User from './User';

// 비동기 함수 
// useAsync에서 fetchData의 callback()에 해당하는 부분
async function getUsers() {
    const response = await axios.get(
        'https://jsonplaceholder.typicode.com/users',
    );
    return response.data;
}

function Users() {
    // 이렇게 호출하면 useAsync Hook에서 반환하는 [state, fetchData]가 [state, refetch]에 들어가게 됨
    // state에는 API와 통신되어 반환된 데이터가 들어있다
    // refetch는 API와 통신을 수행하는 fetchData를 Users.js에서 호출할 수 있다는 뜻
    const [state, refetch] = useAsync(getUsers, [], true);
    const [userId, setUserId] = useState(null);
    const { loading, data: users, error } = state;

    if (loading) return <div>로딩중 ...</div>;
    if (error) return <div>에러!!!</div>;
    if (!users) return <button onClick={refetch}>불러오기</button>; // API와 아직 통신을 하지 않은 경우

    return (
        <>
            <ul>
                {users.map(user => (
                    <li key={user.id} onClick={() => setUserId(user.id)}>
                        {user.username} ({user.name})
                    </li>
                ))}
            </ul>
            <button onClick={refetch}>다시 불러오기</button>
            {userId && <User id={userId} />}
        </>
    );
}

export default Users;