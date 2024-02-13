import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ApiProvider } from '../api/ApiProvider';
import FrontPage from './FrontPage'; 


jest.mock('../api/ApiProvider', () => ({
  ...jest.requireActual('../api/ApiProvider'),
  useApi: () => ({
    launchData: [
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
      ],
      filters: { launchYear: '', launchSuccess: null, landSuccess: null },
      handleFilterChange: jest.fn(),
     
    }),
}));

describe('FrontPage Component', () => {
    it('should have correct data types', async () => {
        const { getByTestId } = render(
          <ApiProvider>
            <FrontPage />
          </ApiProvider>
        );
    
        const frontPageContainer = getByTestId('front-page');
       
        const launchButton = getByTestId('launchbuttont');
        const landButton = getByTestId('landbuttont');
        
        const searchInput = getByTestId('inputtest') as HTMLInputElement;
        expect(typeof frontPageContainer).toBe('object');
        expect(searchInput).toHaveProperty('value');
        expect(typeof searchInput.value).toBe('string');
        expect(typeof launchButton).toBe('object');
        expect(typeof landButton).toBe('object');
      });
    it('should render SpaceX Launch Programs header', () => {
        const { getByText } = render(
          <ApiProvider>
            <FrontPage />
          </ApiProvider>
        );
    
        expect(getByText('SpaceX Launch Programs')).toBeInTheDocument();
      });
    
      it('should update search input', async () => {
        const { getByPlaceholderText } = render(
          <ApiProvider>
            <FrontPage />
          </ApiProvider>
        );
    
        const searchInput = getByPlaceholderText('Search') as HTMLInputElement;
        fireEvent.change(searchInput, { target: { value: 'Mission 1' } });
    
        await waitFor(() => {
          expect(searchInput.value).toBe('Mission 1');
        });
      });
      it('should render filter options', () => {
        const { getByText } = render(
          <ApiProvider>
            <FrontPage />
          </ApiProvider>
        );
    
        expect(getByText('Filters')).toBeInTheDocument();
        expect(getByText('Name Search')).toBeInTheDocument();
        expect(getByText('Launch Year')).toBeInTheDocument();
        expect(getByText('Successful Launch')).toBeInTheDocument();
        expect(getByText('Successful Landing')).toBeInTheDocument();
      });
    
      it('should render year tags correctly', () => {
        const { getAllByRole, getByRole } = render(
          <ApiProvider>
            <FrontPage />
          </ApiProvider>
        );
    
        const yearTags = getAllByRole('button', { name: /20\d{2}/ });
    
        expect(yearTags).toHaveLength(15);
    
        const expectedYears = [
          '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014',
          '2015', '2016', '2017', '2018', '2019', '2020'
        ];
    
        expectedYears.forEach((year) => {
          const tag = getByRole('button', { name: year });
          expect(tag).toBeInTheDocument();
          expect(tag).not.toHaveClass('active-tag');
        });
      });
    
      it('should render launch data correctly in cards', () => {
        const { getByTestId, getByAltText } = render(
          <ApiProvider>
            <FrontPage />
          </ApiProvider>
        );
    
        const cards = getByTestId('cards-container').querySelectorAll('[data-testid="cardtest"]');
        expect(cards).toHaveLength(2);
    
        const card = cards[0];
       
        expect(card).toHaveTextContent('Mission 1 #1');
        expect(card).toHaveTextContent('Mission IDs: ABC123');
        expect(card).toHaveTextContent('Launch Year: 2019');
        expect(card).toHaveTextContent('Launch Success: True');
        expect(card).toHaveTextContent('Successful Landing : True');
    
        const img = getByAltText('Mission 1');
        expect(img).toHaveAttribute('src', 'https://images2.imgbox.com/6f/c0/D3Owbmpo_o.png');
      });
      it('should render launch cards for each launch', async () => {
        const { getByTestId, getByAltText } = render(
          <ApiProvider>
            <FrontPage />
          </ApiProvider>
        );
    
        const cards = getByTestId('cards-container').querySelectorAll('[data-testid="cardtest"]');
        expect(cards).toHaveLength(2);
    
        const card = cards[0];
       
        expect(card).toHaveTextContent('Mission 1 #1');
        expect(card).toHaveTextContent('Mission IDs: ABC123');
        expect(card).toHaveTextContent('Launch Year: 2019');
        expect(card).toHaveTextContent('Launch Success: True');
        const img = getByAltText('Mission 1');
        expect(img).toHaveAttribute('src', 'https://images2.imgbox.com/6f/c0/D3Owbmpo_o.png');
        const card1 = cards[1];
        expect(card1).toHaveTextContent('Mission 2 #2');
        expect(card1).toHaveTextContent('Mission IDs: XYZ789');
        expect(card1).toHaveTextContent('Launch Year: 2020');
        expect(card1).toHaveTextContent('Launch Success: False');
        expect(card1).toHaveTextContent('Successful Landing : False');
        const img1 = getByAltText('Mission 2');
        expect(img1).toHaveAttribute('src', 'https://images2.imgbox.com/6f/c0/D3Owbmpo_o.png');
    
      });
    
      it('filters launches by launch year', async () => {
        const {getByRole,queryByText}=render(<ApiProvider><FrontPage /></ApiProvider>);
        const yearButton =  getByRole('button', { name: '2019',exact: false })
        expect(yearButton).toBeInTheDocument();
        fireEvent.click(yearButton);
        await waitFor(() => {
          expect(queryByText('Launch Year: 2011')).toBeNull();
          expect(queryByText('Launch Year: 2020')).toBeNull();
        });
      });
    

    it('should toggle launch success filter', async () => {
        const { getByTestId, getByText } = render(
          <ApiProvider>
            <FrontPage />
          </ApiProvider>
        );
    
        const trueButton = getByTestId('launchbuttont');
        const falseButton = getByTestId('launchbuttonf');
    
 
        expect(trueButton).not.toHaveClass('active');
        expect(falseButton).not.toHaveClass('active');
 
        fireEvent.click(trueButton);
        await waitFor(() => {
    
          expect(trueButton).toHaveClass('ant-btn css-dev-only-do-not-override-1rqnfsa ant-btn-default sc-beySPh bKvCei');

          expect(falseButton).not.toHaveClass('active');
        });

        fireEvent.click(falseButton);
        await waitFor(() => {
  
          expect(falseButton).toHaveClass('ant-btn css-dev-only-do-not-override-1rqnfsa ant-btn-default sc-beySPh bKvCei');
         
          expect(trueButton).not.toHaveClass('active');
        });
      });
      it('should update launch year filter', async () => {
        const {getByRole,queryByText}=render(<ApiProvider><FrontPage /></ApiProvider>);
        const yearButton =  getByRole('button', { name: '2019',exact: false })
        expect(yearButton).toBeInTheDocument();
        fireEvent.click(yearButton);
    
        await waitFor(() => {
          expect(yearButton).toHaveClass('ant-btn css-dev-only-do-not-override-1rqnfsa ant-btn-default sc-beySPh bKvCei tag');
        });
      });
      it('should filter launch data based on name search', async () => {
        const {getByRole,getByTestId}=render(<ApiProvider><FrontPage /></ApiProvider>);
        const searchInput = getByTestId('inputtest');
        expect(searchInput).toBeInTheDocument();
        fireEvent.change(searchInput, { target: { value: 'Mission 1' } });
      });
    it('should update search input and filter launch data based on name search', async () => {
        const { getByTestId, getAllByTestId, queryAllByTestId } = render(
          <ApiProvider>
            <FrontPage />
          </ApiProvider>
        );
        const initialCards = queryAllByTestId('cardtest');
        expect(initialCards).toHaveLength(2);
        const searchInput = getByTestId('inputtest');
        fireEvent.change(searchInput, { target: { value: 'Mission 2' } });
      
        await waitFor(() => {
          const updatedCards = queryAllByTestId('cardtest');
          expect(updatedCards).toHaveLength(1);
          const mission2Card = updatedCards[0];
          expect(mission2Card).toHaveTextContent('Mission 2 #2');
        });
      });
    

});
