package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Book struct {
	gorm.Model
	Id          int    `json:"id"`
	Title       string `json:"title"`
	Author      string `json:"author"`
	Description string `json:"description"`
	Content     string `json:"content"`
	// 其他书籍相关字段
}

//go:embed frontend/dist/*
var f embed.FS
var db *gorm.DB

func main() {
	// GORM 初始化和配置
	db, _ = gorm.Open(sqlite.Open("lunar-reader.db"), &gorm.Config{})
	// if err != nil {
	// 	panic("Failed to connect to database")
	// }
	// 迁移数据库
	db.AutoMigrate(&Book{})

	// 创建Gin路由
	router := gin.Default()
	// 添加路由处理函数
	apiRouter := router.Group("/api/v1")
	apiRouter.POST("/book", uploadBook)
	apiRouter.GET("/book/:id", getBookInfo)
	apiRouter.DELETE("/book/:id", deleteBook)
	apiRouter.GET("/book/:id/content", getBookContent)
	apiRouter.GET("/export", exportDatabase)
	apiRouter.GET("/bookshelf", getBookshelfList)
	subFS, err := fs.Sub(f, "frontend/dist")
	if err != nil {
		log.Fatal(err)
	}
	router.NoRoute(gin.WrapH(http.FileServer(http.FS(subFS))))

	// 启动服务器
	router.Run(":8000")
}

// 获取书架列表
func getBookshelfList(c *gin.Context) {
	var books []Book
	result := db.Select("id, title, author, description").Find(&books)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bookshelf"})
		return
	}

	c.JSON(200, books)
}

// 获取单本书籍信息
func getBookInfo(c *gin.Context) {
	bookID := c.Param("id")

	var book Book
	result := db.First(&book, bookID)
	if result.Error != nil {
		c.JSON(404, gin.H{"error": "Book not found"})
		return
	}

	c.JSON(200, book)
}

// 获取书籍内容
func getBookContent(c *gin.Context) {
	bookID := c.Param("id")
	page := c.Query("page")
	limit := c.Query("limit")

	var book Book
	result := db.First(&book, bookID)
	if result.Error != nil {
		c.JSON(404, gin.H{"error": "Book not found"})
		return
	}

	// 这里根据页码和限制数量进行内容分页处理
	log.Println(page, limit)

	// 假设你有一个名为 bookContent 的字段存储书籍内容
	content := book.Content

	c.JSON(200, content)
}

// 删除书籍
func deleteBook(c *gin.Context) {
	bookID := c.Param("id")

	var book Book
	result := db.Delete(&book, bookID)
	if result.Error != nil {
		c.JSON(404, gin.H{"error": "Book not found"})
		return
	}

	c.JSON(200, gin.H{"message": "Book deleted successfully"})
}

// 上传小说
func uploadBook(c *gin.Context) {
	// 获取请求中的表单数据
	title := c.PostForm("title")
	author := c.PostForm("author")
	description := c.PostForm("description")
	content := c.PostForm("content")

	// 创建书籍记录并保存到数据库
	book := Book{
		Title:       title,
		Author:      author,
		Description: description,
		Content:     content,
	}
	result := db.Create(&book)
	if result.Error != nil {
		c.JSON(500, gin.H{"error": "Failed to save book information"})
		return
	}

	c.JSON(200, gin.H{"message": "Book uploaded successfully"})
}

// 导出数据库
func exportDatabase(c *gin.Context) {
	// 获取数据库文件的路径
	dbPath := "path/to/database/lunar-reader.db"

	// 将数据库文件作为响应返回给前端
	c.Header("Content-Disposition", "attachment; filename=lunar-reader.db")
	c.Header("Content-Type", "application/octet-stream")
	c.FileAttachment(dbPath, "lunar-reader.db")
}
