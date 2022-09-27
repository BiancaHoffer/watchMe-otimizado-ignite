import { useEffect, useState, useCallback, lazy } from 'react';

import { api } from './services/api';

import { Content } from './components/Content';
import { SideBar } from './components/SideBar';

import './styles/global.scss';

import './styles/sidebar.scss';
import './styles/content.scss';


interface GenreResponseProps {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

export function App() {
  // id dos generos e/ou filmes
  const [selectedGenreId, setSelectedGenreId] = useState(1);

  // dados dos generos
  const [genres, setGenres] = useState<GenreResponseProps[]>([]);

  // dados dos filmes
  const [movies, setMovies] = useState<MovieProps[]>([]);

// genero selecionado
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);

  useEffect(() => {
    // chama todos os gereros
    api.get<GenreResponseProps[]>('genres').then(response => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    // filme escolhido
    api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
      setMovies(response.data);
    });

    // genero escolhido
    api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then(response => {
      setSelectedGenre(response.data);
      console.log(selectedGenre)
    })
  }, [selectedGenreId]);
  // chamado toda vez que id muda

  // useCallback: função de pai(App) para filho(SideBar)
  const handleClickButton = useCallback((id: number) => {
    setSelectedGenreId(id);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <SideBar
        genres={genres}
        selectedGenreId={selectedGenreId}
        buttonClickCallback={handleClickButton}
      />

      <Content
        selectedGenre={selectedGenre}
        movies={movies}
      />
    </div>
  )
}