<div style="height: 50px"></div>




<div class="gallery-container not-prose">
    <div class="gallery-item">{{<portfolio-figure src="images/Cognito_poster.jpg">}}</div>
    <div class="gallery-item">{{<portfolio-figure src="images/Plaid_poster.jpg" >}}</div>
    <div class="gallery-item">{{<portfolio-figure src="images/Transferwise_poster.jpg" >}}</div>
    <div class="gallery-item">{{<portfolio-figure src="images/PhilipsHue3_poster.jpg" >}}</div>
    <div class="gallery-item">{{<portfolio-figure src="images/PhilipsHue2_poster.jpg" >}}</div>
    <div class="gallery-item">{{<portfolio-figure src="images/RemgeldFacturatie_poster.jpg" >}}</div>
    <div class="gallery-item">{{<portfolio-figure src="images/Demeyere_poster.jpg" >}}</div>
    <div class="gallery-item">{{<portfolio-figure src="images/Brickeffect_poster.jpg" >}}</div>
    <div class="gallery-item">{{<portfolio-figure src="images/Nieuwsblad_poster.jpg" >}}</div>
    <div class="gallery-item">{{<portfolio-figure src="images/LandscapeVideoCamera_poster.jpg" >}}</div>
    <div class="gallery-item">{{<portfolio-figure src="images/SaecoAvanti_poster.jpg" >}}</div>
    <div class="gallery-item">{{<portfolio-figure src="images/HuePos_poster.jpg" >}}</div>
    <div class="gallery-item">{{<portfolio-figure src="images/SmartAir_poster.jpg" >}}</div>
    <div class="gallery-item">{{<portfolio-figure src="images/eventapp_poster.jpg" >}}</div>
    <div class="gallery-item">{{<portfolio-figure src="images/Tomorrowland_poster.jpg" >}}</div>
    <div class="gallery-item">{{<portfolio-figure src="images/Eurosprinters_poster.jpg" >}}</div>
    <div class="gallery-item">{{<portfolio-figure src="images/AirStudio_poster.jpg" >}}</div>
    <div class="gallery-item">{{<portfolio-figure src="images/WiFileTransfer_poster.jpg" >}}</div>
    <div class="gallery-item">{{<portfolio-figure src="images/Videodagboek_onepager.jpg" >}}</div>
</div>

<style>
  /* Gallery Grid */
  .gallery-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
    max-width: 1000px;
    margin: 0 auto;
  }

  .gallery-item img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.3s ease;
    margin: 0px;
  }

  .gallery-item img:hover {
    transform: scale(1.05);
  }

  @media (min-width: 600px) {
    .gallery-container {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 800px) {
    .gallery-container {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>