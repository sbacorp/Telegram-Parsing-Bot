import {
	Keyboard,
} from "https://deno.land/x/grammy@v1.12.0/mod.ts"

 export const subscription = new Keyboard ()
// .img("file:///C:/Users/Вячеслав/photo_2022-11-03_14-03-12.jpg")
.text("Купить на 1 день [ 4$ = 249p ]") 
.row()
.text("Купить на 3 день [ 8$ = 349p ]") 
.row()
.text("Купить на 7 день [ 15$ = 699p ]") 
.row()
.text("Купить на 31(30) день [ 60$ = 3899p ]")
.row()
.text("◀️ Назад");
