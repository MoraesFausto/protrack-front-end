import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeamService } from '../../service/team.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from '../../../../app.component';


@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],

})
export class TeamFormComponent implements OnInit {
  teamForm: FormGroup;
  isEditMode = false;
  teamId!: string;

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.teamForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.teamId = params['id'];
        // Carregar dados do time para edição
        this.teamService.getTeams().then(teams => {
          const team = teams.find((t: any) => t.id === this.teamId);
          if (team) {
            this.teamForm.patchValue(team);
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (this.teamForm.valid) {
      const teamData = this.teamForm.value;

      if (this.isEditMode) {
        this.teamService.updateTeam(teamData).then(() => {
          this.router.navigate(['/teams']);
        });
      } else {
        this.teamService.createTeam(teamData).then(() => {
          this.router.navigate(['/teams']);
        });
      }
    }
  }
}



@NgModule({
  declarations: [

    // outros componentes como TeamListComponent, TeamMembersComponent, etc.
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot([]),
    AppComponent,
    TeamFormComponent,

  ],
  bootstrap: []
})
export class AppModule {}
export class TeamFormModule { }
