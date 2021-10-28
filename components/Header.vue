<template>
    <div>  <div class="links">


        <span id="summary-trigger" class="type__nav-item type__trigger"><a
            href="/users"
            class="submission-button">SUMMARY</a></span><span class="type__pipe"> | </span>
        <span id="ledger-trigger" class="type__nav-item type__trigger"><a
            href="/users"
            class="submission-button">LEDGER</a></span><span class="type__pipe"> | </span>
        <span id="transaction-trigger" class="type__nav-item type__trigger"><a
            href="/users"
            class="submission-button">TRANSACTION</a></span><span class="type__pipe"> | </span>
        <span id="members-trigger" class="type__nav-item type__trigger"><a
            href="/users"
            class="submission-button">MEMBERS</a></span><span class="type__pipe"> | </span>
    </div><!-- NAV -->
    <div class="links">
        <span class="type__subnav-link type__trigger">broker training videos</a></span> |
        <span class="type__subnav-link type__trigger">help articles</a></span>
    </div><!-- SUB NAV -->

    </div>
</template>

<script>
    export default {

    }
</script>

<style>

.submission-button {
   margin: 2rem 0;
   font-size: .8rem;
    min-width: 40vw;
    padding: 1.5rem;
    color: white;
    border-radius: 12px;
    background-color: #601d46;
}

.submission-button:hover {

  cursor: pointer;
  background-color: #e79f39;
}

.layout__nav {
    display: flex;
    justify-content: space-around;
    align-content: center;

    margin-left: auto;
    margin-right: auto;
    padding: 10px;

    border: 1px solid grey;
}

.layout__sub-nav {
    display: flex;
    justify-content: space-around;
    align-content: center;
    margin-top: .5rem;
    margin-left: auto;
    margin-right: auto;
    /*border: 1px solid gold;*/
}

.layout__major-section {
    margin: 3rem 6rem;
}

.layout__submission-button {
    margin: 2rem 0;
    min-width: 40vw;
    padding: 1.5rem;
    color: white;
    border-radius: 12px;
    background-color: #601d46;
}

.layout__submission-button:hover {
    cursor: pointer;
    background-color: #e79f39;
}


.hidden { display: none; }

.small-space { width: 5px; height: 50px; }
.medium-space { width: 5px; height: 100px; }
.large-space { width: 5px; height: 200px; }

</style>