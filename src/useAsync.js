import { useReducer, useCallback, useEffect } from 'react';

function reducer(state, action) {
    switch (action.type) {
        case 'LOADING':
            return {
                loading: true,
                data: null,
                error: null,
            };
        case 'SUCCESS': // API로부터 데이터를 읽어들이고 받아오기에 성공시 dispatch를 통해 호출됨
            return {
                loading: false,
                data: action.data,
                error: null,
            };
        case 'ERROR':
            return {
                loading: false,
                data: null,
                error: action.error,
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};

export function useAsync(callback, deps = [], skip = false) {
    // state의 초기값으로 객체(loading,data,error)와 위에 만들어둔 reducer함수를 넣어줌
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        data: null,
        error: null,
    });

    // async함수에서는 await가 실행되면, 그것이 끝날때까지 다른 것들이 돌아가지 못함
    const fetchData = useCallback(async () => {
        dispatch({ type: 'LOADING' });
        try { //callback()함수는 useAsync Hook의 매개변수에 들어있다 <- API 통신 부분
            const data = await callback(); // error가 없으면 const data에 데이터를 받아옴-> dispatch를 통해 객체 형태로 값을 받아옴
            dispatch({ type: 'SUCCESS', data });
        } catch (e) {
            dispatch({ type: 'ERROR', error: e });
        }
    }, [callback]);

    useEffect(() => {
        if (skip) return; //버튼을 통해서 회원정보를 불러오도록 skip이 false일때만 fetchData를 실행
        fetchData();
    }, deps);

    return [state, fetchData];
}