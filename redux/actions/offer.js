import axios from 'axios';
import {server} from '../store';

export const getAllOffers = () => async dispatch => {
  try {
    dispatch({type: 'offerRequest'});

    const {data} = await axios.get(`${server}/admin/offers`, {
      withCredentials: true,
    });
    dispatch({type: 'offerSuccess', payload: data});
  } catch (error) {
    dispatch({type: 'offerFail', payload: error.response.data.error});
  }
};

export const getSingleOffer = id => async dispatch => {
  try {
    dispatch({type: 'getOfferRequest'});

    const {data} = await axios.get(`${server}/admin/offer/${id}`, {
      withCredentials: true,
    });

    dispatch({type: 'getOfferSuccess', payload: data});
  } catch (error) {
    dispatch({
      type: 'getOfferFail',
      payload: error.response.data.error,
    });
  }
};

export const getAllAppOffers = userId => async dispatch => {
  try {
    dispatch({type: 'offerAppRequest'});

    const {data} = await axios.post(
      `${server}/admin/appoffers`,
      {userId},
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      },
    );
    dispatch({type: 'offerAppSuccess', payload: data});
  } catch (error) {
    dispatch({type: 'offerAppFail', payload: error.response.data.message});
  }
};

export const getAllShoppingOffers = userId => async dispatch => {
  try {
    dispatch({type: 'offerShoppingRequest'});

    const {data} = await axios.post(
      `${server}/admin/shoppingoffers`,
      {userId},
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      },
    );
    dispatch({type: 'offerShoppingSuccess', payload: data});
  } catch (error) {
    dispatch({type: 'offerShoppingFail', payload: error.response.data.message});
  }
};
