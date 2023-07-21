import { 
  ActionCreatorWithOptionalPayload, 
  ActionReducerMapBuilder, 
  createAction, 
  createReducer 
} from '@reduxjs/toolkit';

import { Concert } from '../../Types';
import { WritableDraft } from 'immer/dist/internal';

interface ConcertsState {
  activeConcerts: Concert[];
  selectedConcert: Concert | null;
  selectedTicketCount: number;
}

const initialActiveConcerts: Concert[] = [
  {
    id: 192837465,
    title: 'TESSERACT',
    artistImage: 'https://i.scdn.co/image/69613b28d8aaf618494f0423d38e0f8675fc44c7',
    additionalArtists: ['Intervals', 'Alluvial'],
    date: 1699232400000,
    description: 'TESSERACT - War Of Being Tour',
    price: 85.99,
    sellerNotes: 'This concert is for people ages 18+. COVID-19 vaccination not required. Masks not required.',
    venue: 'The Underground',
    city: 'Charlotte, Virginia'
  },
  {
    id: 918273645,
    title: 'Architects',
    artistImage: 'https://i.scdn.co/image/fcba450f66a488184485009c9984e98c4e010ce4',
    additionalArtists: ['While She Sleeps', 'Bad Omens'],
    date: 1693882800000,
    description: 'ARCHITECTS - For Those That Wish To Exist/The Classic Symptoms Of A Broken Spirit Tour',
    price: 49.95,
    sellerNotes: 'This concert is for people ages 18+. COVID-19 vaccination not required. Masks not required.',
    venue: 'Port Of Burgas',
    city: 'Burgas, Bulgaria'
  }
]

const initialState: ConcertsState = {
  activeConcerts: initialActiveConcerts,
  selectedConcert: null,
  selectedTicketCount: 0
}

export const ConcertActions = {
  incrementSelectedTicketCount: createAction('incrementTicketCount'),
  decrementSelectedTicketCount: createAction('decrementTicketCount'),
  selectConcert: createAction<Concert>('selectConcert'),
  deselectConcert: createAction('deselectConcert')
}

export const concertReducer = createReducer(
  initialState,
  (builder: ActionReducerMapBuilder<ConcertsState>) => {
    builder
      .addCase(
        ConcertActions.incrementSelectedTicketCount, 
        (state: WritableDraft<ConcertsState>) => {
          state.selectedTicketCount += 1;
        }
      )
      .addCase(
        ConcertActions.decrementSelectedTicketCount,
        (state: WritableDraft<ConcertsState>) => {
          state.selectedTicketCount -= 1;
        }
      )
      .addCase(
        ConcertActions.selectConcert,
        (state: WritableDraft<ConcertsState>, action: { payload: any; type: string; }) => {
          state.selectedConcert = action.payload;
        }
      )
      .addCase(
        ConcertActions.deselectConcert,
        (state: WritableDraft<ConcertsState>) => {
          state.selectedConcert = null;
        }
      )
      .addDefaultCase((state, action) => {})
  }
)