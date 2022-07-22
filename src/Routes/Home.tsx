import { useQuery } from "@tanstack/react-query"
import { AnimatePresence, motion, useViewportScroll } from "framer-motion"
import { useState } from "react"
import { useMatch, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { isConstructorDeclaration } from "typescript"
import { getMovies, IGetMoviesResult } from "../api"
import { makeImagePath } from "../utils"

const Wrapper = styled.div`
    background : black; 
    padding-bottom:200px;
`
const Loader = styled.div`
    height : 20vh;
    display :flex; 
    justify-content : center; 
    align-items : center; 
`
const Banner = styled.div<{ bgPhoto: string }>`
    height : 100vh; 
    display : flex;
    flex-direction : column;
    justify-content :center;
    padding : 60px;
    background-image : linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)), url(${props => props.bgPhoto});
    background-size :cover;
`
const Title = styled.h2`
font-size : 54px;
margin-bottom : 20px;
`;

const OverView = styled.p`
font-size : 25px;
width : 40%;
`
const SliderTitle = styled.span`
    position:relative;
    padding : 10px;
    top : -110px;
    font-size : 20px;
    color : ${props=>props.theme.white.lighter};    
`
const Slider = styled.div`
    position : relative;
    top : -100px;
`
const Row = styled(motion.div)`
    display : grid; 
    grid-template-columns: repeat(6,  1fr); 
    gap:5px;
    position : absolute;
    width : 100%;
`
const Box = styled(motion.div) <{ bgPhoto: string }>`
    background-color : white;
    background-image : url(${props => props.bgPhoto});
    background-size : cover;
    background-position : center center;
    height : 200px;
    font-size : 20px;
    &:first-child {
        transform-origin : center left; 
    }
    &:last-child {
        transform-origin : center right;
    }
    cursor : pointer;
`
const Info = styled(motion.div)`
    padding : 10px; 
    background-color :${props => props.theme.black.lighter};
    opacity : 0;
    position : absolute;
    width : 100%;
    bottom : 0;
    
    h4 {
        text-align :center; 
        font-size : 16px;
    }
`
const Overlay = styled(motion.div)`
    position:fixed;
    top : 0; 
    width: 100%; 
    height : 100%; 
    background-color : rgba(0,0,0,0.7);
    opacity :0;
`
const BigMovie = styled(motion.div)`
    position: absolute;
    height: 80vh; 
    width: 40vw;
    left: 0;
    right: 0; 
    margin: 0 auto; 
    border-radius : 15px;
    overflow : hidden;
    background-color : ${props=>props.theme.black.lighter};
`
const BigCover = styled.div`
    width: 100%;
    background-size : cover;
    background-position : center center;
    height : 400px;
`
const BigTitle = styled.h3`
    color : ${props=>props.theme.white.lighter};
    padding : 15px; 
    font-size : 32px;
    position : relative;
    top: -60px;
`; 
const BigOverview = styled.p`
    padding : 20px; 
    color : ${props=> props.theme.white.lighter};
    top : -60px;
    position : relative;
`
const rowVariants = {
    hidden: {
        x: window.innerWidth,
    },
    visible: {
        x: 0
    },
    exit: {
        x: -window.innerWidth,
    }
}
const offset = 6;
const boxVariants = {
    normal: {
        scale: 1
    },
    hover: {
        scale: 1.3,
        y: -50,

        transition: {
            delay: 0.5,
            duration: 0.3,
            type: "tween"
        }
    }

}
const infoVariants = {
    hover: {
        opacity: 1,
        transition: {
            delay: 0.5,
            duration: 0.1,
            type: "tween"
        }
    }
}
const Home = () => {
    const navigate = useNavigate()
    const bigMovieMatch = useMatch("/movies/:movieId")
    // console.log(bigMovieMatch)
    const { isLoading, data } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies)
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false)
    const { scrollY } = useViewportScroll()
    const increaseIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = data.results.length - 1
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex(prev => prev === maxIndex ? 0 : prev + 1)
        }
    }
    const toggleLeaving = () => setLeaving(prev => !prev)
    const onBoxClicked = (movieId: number) => {
        navigate(`/movies/${movieId}`)
    }
    const onOverlayClick = () => navigate('/')
    const clickedMovie = bigMovieMatch?.params.movieId && data?.results.find(movie => movie.id+"" === bigMovieMatch.params.movieId)
    console.log(clickedMovie)
    return (
        <Wrapper>
            {isLoading ? <Loader> Loading... </Loader> : <>
                <Banner bgPhoto={makeImagePath(data?.results[1].backdrop_path || "")}>
                    <Title>{data?.results[1].title}</Title>
                    <OverView>{data?.results[1].overview}</OverView>
                </Banner>
                <SliderTitle>Now Playing</SliderTitle>
                <Slider>
                    {/* AnimatePresence 컴포넌트 시작, 끝 */}
                    <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                        <Row key={index} variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: "tween", duration: 1 }}>
                            {data?.results.slice(1).slice(offset * index, offset * index + offset).map((movie) =>
                                <Box
                                    variants={boxVariants}
                                    whileHover="hover"
                                    initial="normal"
                                    key={movie.id}
                                    onClick={() => onBoxClicked(movie.id)}
                                    transition={{ type: "tween" }}
                                    bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                                    layoutId={movie.id + ""}
                                >

                                    <Info variants={infoVariants}>
                                        <h4>{movie.title}</h4> </Info>
                                </Box>

                            )
                            }
                        </Row>
                    </AnimatePresence>
                </Slider>
                <AnimatePresence>
                    {
                        bigMovieMatch ?
                            <>
                                <Overlay onClick={onOverlayClick} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                                <BigMovie
                                    layoutId={bigMovieMatch.params.movieId}
                                    style={{ top: scrollY.get() + 100 }}
                                >
                                    {clickedMovie && 
                                        <>
                                        <BigCover style={{
                                            backgroundImage : `linear-gradient(to top, black, transparent), url(${makeImagePath(clickedMovie.backdrop_path, "w500")})`}} />
                                 
                                            <BigTitle>{clickedMovie.title}</BigTitle>
                                            <BigOverview>{clickedMovie.overview}</BigOverview>
                                        </>
                                    }
                                </BigMovie>
                            </>
                            : null
                    }
                </AnimatePresence>
            </>}
        </Wrapper>
    )
}
export default Home 