import Header from '../../components/Header/Header'
import MealCard from '../../components/MealCard/MealCard'
import { useHomeViewModel } from './useHomeViewModel'

function HomeView() {
  const { query, setQuery, meals, loading, error, handleSearch } = useHomeViewModel()

  return (
    <main>
      <Header query={query} onQueryChange={setQuery} onSearch={handleSearch} />

      {loading && <p>Loading...</p>}
      {error && <p role="alert">{error}</p>}

      <section>
        {meals.map((meal) => (
          <MealCard key={meal.idMeal} meal={meal} />
        ))}
      </section>
    </main>
  )
}

export default HomeView
