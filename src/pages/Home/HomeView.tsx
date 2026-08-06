import Header from '../../components/Header/Header'
import MealCard from '../../components/MealCard/MealCard'
import { useHomeViewModel } from './useHomeViewModel'
import './HomeView.css'

function HomeView() {
  const {
    query,
    setQuery,
    meals,
    loading,
    error,
    handleSearch,
    resetHome,
    handleFavourite,
    favouriteIds,
  } = useHomeViewModel()

  return (
    <main className="home">
      <Header
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        onHomeClick={resetHome}
      />

      {loading && <p className="home__status">Loading...</p>}
      {error && (
        <p className="home__status" role="alert">
          {error}
        </p>
      )}

      <section className="home__list">
        {meals.map((meal) => (
          <MealCard
            key={meal.idMeal}
            meal={meal}
            onFavourite={handleFavourite}
            isFavourite={favouriteIds.has(meal.idMeal)}
          />
        ))}
      </section>
    </main>
  )
}

export default HomeView
