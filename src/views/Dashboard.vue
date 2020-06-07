<template>
	<div class="container">
		<div class="row">
			<div class="col-md-6">
				<div class="media">
					<div class="media-header">
						<i class="fa fa-align-justify"></i> ColumnChart    
					</div>  
					<div class="media-body">
						<GChart
							:settings="{ packages: ['corechart', 'table', 'map'] }"
							type="ColumnChart"
							:data="chartData"
							:options="chartOptions"/>
					</div>
				</div>
			</div>
			<div class="col-md-6">
				<div class="media">
					<div class="media-header">
						<i class="fa fa-align-justify"></i> BarChart    
					</div>  
					<div class="media-body">
						<GChart
							:settings="{ packages: ['corechart', 'table', 'map'] }"
							type="BarChart"
							:data="chartData"
							:options="chartOptions"/>
					</div>
				</div>
			</div>
		</div>
		<div class="row mt-4">	
			<div class="col-md-6">
				<div class="media">
					<div class="media-header">
						<i class="fa fa-align-justify"></i> PieChart    
					</div>  
					<div class="media-body">
						<GChart
							:settings="{ packages: ['corechart', 'table', 'map'] }"
							type="PieChart"
							:data="chartData"
							:options="chartOptions"/>
					</div>
				</div>
			</div>
			<div class="col-md-6">
				<div class="media">
					<div class="media-header">
						<i class="fa fa-align-justify"></i> LineChart    
					</div>  
					<div class="media-body">
						<GChart
							:settings="{ packages: ['corechart', 'table', 'map'] }"
							type="LineChart"
							:data="chartData"
							:options="chartOptions"/>
					</div>
				</div>
			</div>
		</div>
	</div>	
</template>

<script>
	import { GChart } from 'vue-google-charts'

	export default {
		name: 'Dashboard',
		data () {
			return {
				chartData: [
					['Year', 'Sales', 'Expenses', 'Profit'],
					['2014', 1000, 400, 200],
					['2015', 1170, 460, 250],
					['2016', 660, 1120, 300],
					['2017', 1030, 540, 350]
				],
				chartOptions: {
					chart: {
						title: 'Company Performance',
						subtitle: 'Sales, Expenses, and Profit: 2014-2017',
					}
				}
			}
		},
		components: {
			GChart
		},
	}
</script>
