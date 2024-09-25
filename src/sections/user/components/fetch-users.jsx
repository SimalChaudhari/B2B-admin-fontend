import { useDispatch } from 'react-redux';
import { deleteUser, userList } from 'src/store/action/userActions';


export const useFetchUserData = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    await dispatch(userList());
  };

  const fetchDeleteData = async (id) => {
    await dispatch(deleteUser(id));
  };

  return { fetchData, fetchDeleteData };
};
