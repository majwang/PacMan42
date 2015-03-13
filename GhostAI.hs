module GhostAI where

data Pacman = Pacman { pacX :: Int, pacY :: Int } deriving Show
data Ghost = Ghost { ghostX :: Int, ghostY :: Int, ghostDirection :: Int} deriving Show
data Wall = Wall { wallX :: Int, wallY :: Int, wallType :: Bool } deriving Show

pacMan :: Int -> Int -> Pacman
pacMan x y = Pacman x y

ghost :: Int -> Int -> Int -> Ghost
ghost x y d = Ghost x y d

wall :: Int -> Int -> Bool -> Wall
wall x y t = Wall x y t

--wallsIndex = (x/50) + ((y*23)/50);
getIndex :: Ghost -> Int
getIndex gh = ((ghostX gh) `div` 50) + ((ghostY gh)*23 `div` 50)

checkBelow :: [Wall] -> Int -> Ghost -> Pacman -> Int -> Int ->(Int, Int)
checkBelow walls index ghost player random previous
					|	wallType isWall = if ((previous /= 1) || not(wallType (walls !! (index + 1)))) then checkRight walls index ghost player random 2 else 
											if (previous /= 3) then checkLeft walls index ghost player random 2 else checkRight walls index ghost player random 2
					|	otherwise       = (ghostX ghost, (ghostY ghost) + 50)
					where isWall = (walls !! (index + 23))
					
checkAbove :: [Wall] -> Int -> Ghost -> Pacman ->  Int -> Int -> (Int, Int)
checkAbove walls index ghost player random previous
					|	wallType isWall = if ((previous /= 1) || not(wallType (walls !! (index + 1)))) then checkRight walls index ghost player random 0 else checkLeft walls index ghost player random 0
					|	otherwise       = (ghostX ghost, (ghostY ghost) - 50)
					where isWall = (walls !! (index - 23))
					
checkRight :: [Wall] -> Int -> Ghost -> Pacman -> Int -> Int -> (Int, Int)
checkRight walls index ghost player random previous
					|	wallType isWall = if ((previous /= 0) || not(wallType (walls !! (index - 23)))) then checkAbove walls index ghost player random 1 else 
											if (previous /= 2) then checkBelow walls index ghost player random 2 else checkAbove walls index ghost player random 1
					|	otherwise       = ((ghostX ghost)  + 50, ghostY ghost)
					where isWall = (walls !! (index + 1))
					
checkLeft :: [Wall] -> Int -> Ghost -> Pacman -> Int -> Int -> (Int, Int)
checkLeft walls index ghost player random previous 
					|	wallType isWall = if ((previous /= 0) || not(wallType (walls !! (index - 1)))) then checkAbove walls index ghost player random 3 else checkBelow walls index ghost player random 3
					|	otherwise       = ((ghostX ghost) - 50, ghostY ghost)
					where isWall = (walls !! (index - 1))

				
--returns to JS file an array containing the x and y coordinate that the ghost is going to move to!
move :: Pacman -> Ghost -> [Wall] -> Int -> (Int, Int)
move player enemy walls random
						| ((ghostY enemy) > (pacY player)) && (xDistance < yDistance) = if (not(wallType (walls !! (currentIndex - 23))) && (ghostDirection enemy) /= 2) then checkAbove walls currentIndex enemy player random (ghostDirection enemy) else
																							if ((ghostDirection enemy) == 2 || pacY player > ghostY enemy) then checkBelow walls currentIndex enemy player random (ghostDirection enemy) else
																								if ((ghostDirection enemy) == 1 || pacX player > ghostX enemy) then checkRight walls currentIndex enemy player random (ghostDirection enemy) else
																									if ((ghostDirection enemy) == 3 || pacX player < ghostX enemy) then checkLeft walls currentIndex enemy player random (ghostDirection enemy) else 
																										checkAbove walls currentIndex enemy player random (ghostDirection enemy)
						| ((ghostY enemy) < (pacY player)) && (xDistance < yDistance) = if (not(wallType (walls !! (currentIndex + 23))) && (ghostDirection enemy) /= 0) then checkBelow walls currentIndex enemy player random (ghostDirection enemy) else
																							if ((ghostDirection enemy) == 0 || pacY player < ghostY enemy) then checkAbove walls currentIndex enemy player random (ghostDirection enemy) else
																								if ((ghostDirection enemy) == 1 || pacX player > ghostX enemy) then checkRight walls currentIndex enemy player random (ghostDirection enemy) else
																									if ((ghostDirection enemy) == 3 || pacX player < ghostX enemy) then checkLeft walls currentIndex enemy player random (ghostDirection enemy) else 
																										checkBelow walls currentIndex enemy player random (ghostDirection enemy)
						| ((ghostX enemy) > (pacX player)) && (yDistance <= xDistance) = if (not(wallType (walls !! (currentIndex - 1))) && (ghostDirection enemy) /= 1) then checkLeft walls currentIndex enemy player random (ghostDirection enemy) else
																							if ((ghostDirection enemy) == 0 || pacY player < ghostY enemy) then checkAbove walls currentIndex enemy player random (ghostDirection enemy) else
																								if ((ghostDirection enemy) == 1 || pacX player > ghostX enemy) then checkRight walls currentIndex enemy player random (ghostDirection enemy) else
																									if ((ghostDirection enemy) == 2 || pacY player > ghostY enemy) then checkBelow walls currentIndex enemy player random (ghostDirection enemy) else 
																										checkLeft walls currentIndex enemy player random (ghostDirection enemy)
						| ((ghostX enemy) < (pacX player)) && (yDistance <= xDistance) = if (not(wallType (walls !! (currentIndex + 1))) && (ghostDirection enemy) /= 3) then checkRight walls currentIndex enemy player random (ghostDirection enemy) else
																							if ((ghostDirection enemy) == 0 || pacY player < ghostY enemy) then checkAbove walls currentIndex enemy player random (ghostDirection enemy) else
																								if ((ghostDirection enemy) == 3 || pacX player < ghostX enemy) then checkLeft walls currentIndex enemy player random (ghostDirection enemy) else
																									if ((ghostDirection enemy) == 2 || pacY player > ghostY enemy) then checkBelow walls currentIndex enemy player random (ghostDirection enemy) else 
																										checkRight walls currentIndex enemy player random (ghostDirection enemy)

                        where currentIndex = (getIndex enemy)
                              xDistance = abs (ghostX enemy - pacX player)
                              yDistance = abs (ghostY enemy - pacY player)

