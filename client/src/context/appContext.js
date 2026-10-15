import React, { useReducer, useContext, useEffect } from 'react';

import reducer from './reducer';
import axios from 'axios';
import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  DELETE_JOB_ERROR,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS,
} from './actions';

const initialState = {
  userLoading: true,
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: null,
  userLocation: '',
  showSidebar: false,
  isEditing: false,
  editJobId: '',
  position: '',
  company: '',
  jobLocation: '',
  jobDescription: '',
  resumeAnalysis: null,
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  jobType: 'full-time',
  statusOptions: ['interview', 'declined', 'pending'],
  status: 'pending',
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const apiBaseUrl = (process.env.REACT_APP_API_URL || '/api/v1').replace(
    /\/+$/,
    ''
  );
  const authFetch = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
  });

  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const isCredentialRequest = ['/auth/login', '/auth/register'].some((route) =>
        error.config?.url?.endsWith(route)
      );
      if (error.response?.status === 401 && !isCredentialRequest) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const setupUser = async ({ currentUser, endPoint, alertText }) => {
    dispatch({ type: SETUP_USER_BEGIN });
    try {
      const { data } = await authFetch.post(`/auth/${endPoint}`, currentUser);

      const { user, location } = data;
      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, location, alertText },
      });
    } catch (error) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: {
            msg:
              error.response?.data?.msg ||
              'Unable to reach the server. Please try again.',
          },
      });
    }
    clearAlert();
  };
  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = async () => {
    try {
      await authFetch.get('/auth/logout');
    } catch (error) {
      // Clear the local session even if the server cannot be reached.
    }
    dispatch({ type: LOGOUT_USER });
  };
  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      const { data } = await authFetch.patch('/auth/updateUser', currentUser);
      const { user, location } = data;

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, location },
      });
    } catch (error) {
      if (error.response?.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: {
            msg:
              error.response?.data?.msg ||
              'Unable to reach the server. Please try again.',
          },
        });
      }
    }
    clearAlert();
  };

  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };
  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES });
  };
  const createJob = async (resumeFile) => {
    dispatch({ type: CREATE_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status, jobDescription } = state;
      const formData = new FormData();
      formData.append('position', position);
      formData.append('company', company);
      formData.append('jobLocation', jobLocation);
      formData.append('jobType', jobType);
      formData.append('status', status);
      formData.append('jobDescription', jobDescription);
      if (resumeFile) formData.append('resume', resumeFile);
      const { data } = await authFetch.post('/jobs', formData);
      dispatch({ type: CREATE_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
      clearAlert();
      return data.job;
    } catch (error) {
      if (error.response?.status === 401) return null;
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { msg: error.response?.data?.msg || 'Unable to save this job.' },
      });
    }
    clearAlert();
    return null;
  };

  const getJobs = async () => {
    const { page, search, searchStatus, searchType, sort } = state;

    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`;
    if (search) {
      url = url + `&search=${search}`;
    }
    dispatch({ type: GET_JOBS_BEGIN });
    try {
      const { data } = await authFetch(url);
      const { jobs, totalJobs, numOfPages } = data;
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs,
          totalJobs,
          numOfPages,
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };

  const setEditJob = (id) => {
    dispatch({ type: SET_EDIT_JOB, payload: { id } });
  };
  const editJob = async (resumeFile) => {
    dispatch({ type: EDIT_JOB_BEGIN });

    try {
      const { position, company, jobLocation, jobType, status, jobDescription } = state;
      const formData = new FormData();
      formData.append('company', company);
      formData.append('position', position);
      formData.append('jobLocation', jobLocation);
      formData.append('jobType', jobType);
      formData.append('status', status);
      formData.append('jobDescription', jobDescription);
      if (resumeFile) formData.append('resume', resumeFile);
      const { data } = await authFetch.patch(`/jobs/${state.editJobId}`, formData);
      dispatch({ type: EDIT_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
      clearAlert();
      return data.updatedJob;
    } catch (error) {
      if (error.response?.status === 401) return null;
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.response?.data?.msg || 'Unable to update this job.' },
      });
    }
    clearAlert();
    return null;
  };
  const deleteJob = async (jobId) => {
    dispatch({ type: DELETE_JOB_BEGIN });
    try {
      await authFetch.delete(`/jobs/${jobId}`);
      getJobs();
    } catch (error) {
      if (error.response?.status === 401) return;
      dispatch({
        type: DELETE_JOB_ERROR,
        payload: {
            msg:
              error.response?.data?.msg ||
              'Unable to reach the server. Please try again.',
          },
      });
    }
    clearAlert();
  };
  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });
    try {
      const { data } = await authFetch('/jobs/stats');
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };
  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
  };
  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } });
  };

  const getCurrentUser = async () => {
    dispatch({ type: GET_CURRENT_USER_BEGIN });
    try {
      const { data } = await authFetch('/auth/getCurrentUser');
      const { user, location } = data;

      dispatch({
        type: GET_CURRENT_USER_SUCCESS,
        payload: { user, location },
      });
    } catch (error) {
      if (error.response?.status === 401) return;
      logoutUser();
    }
  };
  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        setupUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        showStats,
        clearFilters,
        changePage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
