<svelte:head><title>Información | Mundo Hogar</title></svelte:head>
<div class="page-heading">
	<div>
		<p class="eyebrow">ALCANCE Y TRANSPARENCIA</p>
		<h1>Acerca de esta versión</h1>
		<p class="muted">
			Un prototipo para apoyar decisiones comerciales, sin facturación ni contabilidad.
		</p>
	</div>
</div>
<div class="information-grid">
	<section class="panel">
		<h2>Demostración identificada</h2>
		<p>
			Las ventas de enero a diciembre de 2025 y la estimación de enero de 2026 son inventadas para
			probar la interfaz. No son registros de Mundo Hogar ni resultados de Machine Learning.
		</p>
	</section>
	<section class="panel">
		<h2>Perfiles sin autenticación real</h2>
		<p>
			Administradora y trabajador son perfiles de ejemplo. En una aplicación conectada, FastAPI
			deberá verificar la sesión y los permisos en cada operación. Ocultar un menú no protege
			información.
		</p>
	</section>
	<section class="panel">
		<h2>Excel y CSV</h2>
		<p>
			La carga de reportes se implementará con validación, vista previa y confirmación. La interfaz
			no procesa archivos todavía. Ventas e inventario usarán reportes independientes.
		</p>
	</section>
	<section class="panel">
		<h2>Predicciones y fechas</h2>
		<p>
			La predicción prevista es de ingresos totales mensuales con un mes de horizonte. No hay modelo
			ni chatbot conectado. El inventario de 2026 no se utilizará como histórico de 2023–2025.
		</p>
	</section>
</div>
