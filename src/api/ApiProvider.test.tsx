
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { ApiProvider, useApi } from './ApiProvider';

jest.mock('axios');

const mockData = [
  {
    flight_number: 1,
    mission_name: 'Mission 1',
    mission_id: 'ABC123',
    launch_year: '2019',
    launch_success: true,
    rocket: {
      first_stage: {
        cores: [
          {
            land_success: true,
          },
        ],
      },
    },
    links: {
      mission_patch_small: 'https://images2.imgbox.com/6f/c0/D3Owbmpo_o.png',
    },
  },
  {
    flight_number: 2,
    mission_name: 'Mission 2',
    mission_id: 'XYZ789',
    launch_year: '2020',
    launch_success: false,
    rocket: {
      first_stage: {
        cores: [
          {
            land_success: false,
          },
        ],
      },
    },
    links: {
      mission_patch_small: 'https://images2.imgbox.com/6f/c0/D3Owbmpo_o.png',
    },
  },
];

describe('ApiProvider Component', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches and provides launch data through context', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({ data: mockData });
    let renderedData:any;
    function TestComponent() {
      const { launchData } = useApi();
      renderedData = launchData;
      return null;
    }

    render(
      <ApiProvider>
        <TestComponent />
      </ApiProvider>
    );

    await waitFor(() => {
      expect(renderedData).toEqual(mockData);
    });
  });

  it('handles API request error and logs it to the console', async () => {
    jest.spyOn(axios, 'get').mockRejectedValue(new Error('Fake error'));
    let errorLogged = false;
    console.error = () => {
      errorLogged = true;
    };

    render(
      <ApiProvider>
        <div />
      </ApiProvider>
    );

    await waitFor(() => {
      expect(errorLogged).toBeTruthy();
    });
  });
  it('throws an error when used outside of ApiProvider', () => {
    const TestComponent = () => {
      try {
        useApi();
      } catch (error:any) {
        expect(error.message).toBe('useApi must be used within an ApiProvider');
      }
      return null;
    };
    render(<TestComponent />);
  });
});
