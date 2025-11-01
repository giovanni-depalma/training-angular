using Backend.Data;
using Microsoft.EntityFrameworkCore;

// ASP.NET Core application startup file.
// This wires up services (DI), middleware and routes for our small API.
var builder = WebApplication.CreateBuilder(args);

// 1) Register MVC controllers (so we can use Controllers folder with attributes)
builder.Services.AddControllers();

// 2) Swagger/OpenAPI generator – shows nice docs at /swagger in Development
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 3) Database: configure EF Core to use PostgreSQL.
// It reads the connection string "DefaultConnection" from appsettings.json
builder.Services.AddDbContext<TodoDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 4) CORS: allows the Angular frontend (running on another port) to call our API.
// For training simplicity we allow any origin/headers/methods. In production restrict it.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

// NOTE ABOUT DATABASE SCHEMA:
// We don't run EF Core migrations automatically here. The schema is created by Docker init SQL scripts.
// If in the future you want Migrations, enable them explicitly and manage the scripts accordingly.

// HTTP request pipeline (the app's middlewares)
if (app.Environment.IsDevelopment())
{
    // Swagger UI only in Development by default
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection(); // redirect http -> https when possible
app.UseCors("AllowAngular"); // enable the CORS policy defined above
app.UseAuthorization(); // not used now, but keeps the standard pipeline in place
app.MapControllers(); // map controller routes like /todos

app.Run();
