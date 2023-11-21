using Ede.Uofx.Customize.Web.Extensions;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://x.uof.tw").AllowAnyHeader();
                          policy.WithOrigins("http://172.16.3.140")
                            .AllowAnyHeader()
                            .SetIsOriginAllowed((host) => true);
                          policy.WithOrigins("http://172.16.3.143")
                            .AllowAnyHeader()
                            .SetIsOriginAllowed((host) => true);
                          //policy.WithOrigins("capacitor://localhost").AllowAnyHeader();

                      });

});

builder.Services.AddControllersWithViews();
builder.Services.AddControllers();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors(MyAllowSpecificOrigins);

app.UseMiddleware<ApiSignatureMiddleware>();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();
