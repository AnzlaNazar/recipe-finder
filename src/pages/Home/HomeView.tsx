import Header from '../../components/Header/Header'
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
          <article key={meal.idMeal}>
            <img src={meal.strMealThumb} alt={meal.strMeal} />
            <h2>{meal.strMeal}</h2>
            <p>Category: {meal.strCategory ?? 'Unknown'}</p>
            <p>Area: {meal.strArea ?? 'Unknown'}</p>
          </article>
        ))}
      </section>
    </main>
  )
}

export default HomeView
